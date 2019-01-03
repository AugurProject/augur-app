const {
  IMPORT_WARP_SYNC_FILE,
  CONNECTION_ERR,
  GEN_INFO,
  DATABASE_IN_USE,
  UNEXPECTED_ERR,
  RUNNING_FAILURE,
  START_FAILURE,
  INFO_NOTIFICATION,
  ERROR_NOTIFICATION,
  RESET_DATABASE,
  STOP_AUGUR_NODE,
  START_AUGUR_NODE,
  BULK_SYNC_STARTED,
  BULK_SYNC_FINISHED,
  ON_SERVER_DISCONNECTED,
  ON_SERVER_CONNECTED,
  LATEST_SYNCED_BLOCK,
  LIGHT_NODE_NAME
} = require('../utils/constants')
const Augur = require('augur.js')
const log = require('electron-log')
const { AugurNodeController, ControlMessageType } = require('augur-node')
const appData = require('app-data-folder')

const { ipcMain } = require('electron')
const debounce = require('debounce')
const POOL_DELAY_WAIT = 60 * 1000
const DEFAULT_DELAY_WAIT = 1 * 1000

const POOL_MAX_RETRIES = 5
const DEFAULT_MAX_RETRIES = 3
const STATUS_LOOP_INTERVAL = 5000
const STALL_CHECK_TIMEOUT = 5 * 60 * 1000 // 5 minutes
const AUGUR_NODE_RESTART_WAIT = 5 * 1000
const MAX_BLOCKS_BEHIND_BEFORE_RESTART = 1000
const DEFAULT_BLOCKS_PER_CHUNK = 2000
const IS_WARP_SYNC = true // todo: make configurable for user

function AugurNodeServer(selectedNetwork) {
  this.isShuttingDown = false
  this.window = null
  this.statusLoop = null
  this.stallCheckLoop = null
  this.selectedNetwork = selectedNetwork
  this.augur = new Augur()
  this.appDataPath = appData('augur')
  this.augurNodeController = new AugurNodeController(this.augur, this.selectedNetwork, this.appDataPath, IS_WARP_SYNC)
  this.bulkSyncing = false
  this.lastSyncBlockNumber = null
  this.previousLastSyncBlockNumber = null
  ipcMain.on(START_AUGUR_NODE, this.onStartNetwork.bind(this))
  ipcMain.on(RESET_DATABASE, this.onResetDatabase.bind(this))
  ipcMain.on(STOP_AUGUR_NODE, this.shutDownServer.bind(this))
  ipcMain.on(IMPORT_WARP_SYNC_FILE, this.importWarpSyncFile.bind(this))
}

// We wait until the window is provided so that if it fails we can send an error message to the renderer
AugurNodeServer.prototype.setWindow = function(window) {
  this.window = window
  if (window != null) {
    window.once('closed', () => {
      this.window = null
    })
  }
}

AugurNodeServer.prototype.startServer = function() {
  try {
    log.info('Starting Server')
    this.isShuttingDown = false
    var propagationDelayWaitMillis = DEFAULT_DELAY_WAIT
    var maxRetries = DEFAULT_MAX_RETRIES
    var blockPerChunk = DEFAULT_BLOCKS_PER_CHUNK
    this.bulkSyncing = false

    if (this.selectedNetwork.http.indexOf('infura') > -1) {
      propagationDelayWaitMillis = POOL_DELAY_WAIT
      maxRetries = POOL_MAX_RETRIES
    }

    if (!this.selectedNetwork.userCreated && this.selectedNetwork.name === LIGHT_NODE_NAME) {
      blockPerChunk = 25
    }

    log.info(propagationDelayWaitMillis, maxRetries, blockPerChunk)
    this.augurNodeController = new AugurNodeController(
      this.augur,
      Object.assign({}, this.selectedNetwork, {
        propagationDelayWaitMillis,
        maxRetries,
        blockPerChunk
      }),
      this.appDataPath,
      IS_WARP_SYNC
    )
    this.augurNodeController.clearLoggers()
    this.augurNodeController.addLogger(log)

    this.augurNodeController.controlEmitter.on(ControlMessageType.ServerError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.WebsocketError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncStarted, this.onBulkSyncStarted.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncFinished, this.onBulkSyncFinished.bind(this))

    if (this.statusLoop) clearInterval(this.statusLoop)
    this.statusLoop = setInterval(this.requestLatestSyncedBlock.bind(this), STATUS_LOOP_INTERVAL)

    if (this.stallCheckLoop) clearInterval(this.stallCheckLoop)
    this.stallCheckLoop = setInterval(this.doStallCheck.bind(this), STALL_CHECK_TIMEOUT)

    const waiting = setInterval(() => {
      if (this.augurNodeController && this.augurNodeController.isRunning()) {
        this.sendMsgToWindowContents(ON_SERVER_CONNECTED, this.selectedNetwork)
        clearInterval(waiting)
      }
    }, 1000)

    this.augurNodeController.start(
      function(err) {
        log.info('augur-node start:', err.message)
        if (err && err.message.includes('Could not connect')) {
          this.disconnectServerMessage()
          return this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
            messageType: CONNECTION_ERR,
            message: 'Could not connect to endpoint'
          })
        }
        if (this.isShuttingDown) return
        this.restartOnFailure()
      }.bind(this)
    )
  } catch (err) {
    log.error('start catch error:', err)
    this.disconnectServerMessage()
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: START_FAILURE,
      message: err.message
    })
  }
}

AugurNodeServer.prototype.restart = function() {
  try {
    log.info('Restarting Augur Node Server')
    this.shutDownServer()
    setTimeout(() => {
      this.startServer()
    }, 5000)
  } catch (err) {
    log.error('restart:', err)
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: START_FAILURE,
      message: err.message
    })
  }
}

AugurNodeServer.prototype.onError = function(err) {
  log.info('AugurNodeServer onError')
  const errorMessage = (err || {}).message || 'Unexpected Error'
  if (this.window)
    this.window.webContents.send(ERROR_NOTIFICATION, {
      messageType: UNEXPECTED_ERR,
      message: errorMessage
    })
}

AugurNodeServer.prototype.restartOnFailure = debounce(function() {
  log.info('AugurNodeServer restartOnFailure')
  this.restart()
}, AUGUR_NODE_RESTART_WAIT)

AugurNodeServer.prototype.onBulkSyncStarted = function() {
  log.info('Sync with blockchain started.')
  if (this.window) this.window.webContents.send(BULK_SYNC_STARTED)

  setTimeout(() => {
    this.sendMsgToWindowContents(INFO_NOTIFICATION, {
      messageType: GEN_INFO,
      message: 'Downloading logs'
    })
  }, 1500)
  this.bulkSyncing = true
}

AugurNodeServer.prototype.onBulkSyncFinished = function() {
  log.info('Sync with blockchain complete.')
  if (this.window) this.window.webContents.send(BULK_SYNC_FINISHED)

  this.bulkSyncing = false
}

AugurNodeServer.prototype.onResetDatabase = function() {
  try {
    if (this.augurNodeController.isRunning()) {
      return this.sendMsgToWindowContents(INFO_NOTIFICATION, {
        messageType: DATABASE_IN_USE,
        message: 'Cannot reset database while in use'
      })
    } else {
      this.augurNodeController.resetDatabase(this.selectedNetwork.id)
      this.sendMsgToWindowContents(INFO_NOTIFICATION, {
        messageType: GEN_INFO,
        message: 'Database Reset'
      })
    }
  } catch (err) {
    log.error(err)
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: UNEXPECTED_ERR,
      message: err
    })
  }
}

AugurNodeServer.prototype.onStartNetwork = function(event, data) {
  try {
    log.info('onStartNetwork has been called')
    this.selectedNetwork = data
    this.restart()
  } catch (err) {
    log.error('onStartNetwork', err)
    event.sender.send(ERROR_NOTIFICATION, {
      messageType: START_FAILURE,
      message: err
    })
  }
}

AugurNodeServer.prototype.requestLatestSyncedBlock = function() {
  log.info('AugurNodeServer requestLatestSyncedBlock')
  if (this.augurNodeController == null || !this.augurNodeController.isRunning()) return
  this.augurNodeController
    .requestLatestSyncedBlock()
    .then(syncedBlockInfo => {
      this.sendMsgToWindowContents(LATEST_SYNCED_BLOCK, syncedBlockInfo)
      this.lastSyncBlockNumber = syncedBlockInfo.lastSyncBlockNumber
      const blocksBehind = syncedBlockInfo.highestBlockNumber - syncedBlockInfo.lastSyncBlockNumber
      if (!this.bulkSyncing && !this.isShuttingDown && blocksBehind > MAX_BLOCKS_BEHIND_BEFORE_RESTART) {
        log.info(`Behind by ${blocksBehind}. Restarting to bulk sync.`)
        this.restart()
      }
    })
    .catch(err => {
      log.error(err)
      this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
        messageType: RUNNING_FAILURE,
        message: err.message || err || 'Could not process latest block'
      })
    })
}

AugurNodeServer.prototype.doStallCheck = function() {
  log.info('AugurNodeServer doStallCheck')
  if (!this.previousLastSyncBlockNumber) {
    this.previousLastSyncBlockNumber = this.lastSyncBlockNumber
    return
  }
  if (!this.isShuttingDown && this.lastSyncBlockNumber === this.previousLastSyncBlockNumber) {
    log.info(`Sync has stalled at block ${this.lastSyncBlockNumber}. Restarting`)
    this.restart()
  }
  this.previousLastSyncBlockNumber = this.lastSyncBlockNumber
}

AugurNodeServer.prototype.disconnectServerMessage = function() {
  log.info('AugurNodeServer disconnectServerMessage')
  try {
    if (this.statusLoop) clearInterval(this.statusLoop)
    if (this.stallCheckLoop) clearInterval(this.stallCheckLoop)
    if (this.augurNodeController && !this.augurNodeController.isRunning()) {
      this.sendMsgToWindowContents(ON_SERVER_DISCONNECTED)
    }
  } catch (err) {
    log.error(err)
  }
}

AugurNodeServer.prototype.shutDownServer = function() {
  try {
    log.info('Shutdown Augur Node Server')
    this.isShuttingDown = true
    if (this.statusLoop) clearInterval(this.statusLoop)
    if (this.stallCheckLoop) clearInterval(this.stallCheckLoop)
    this.bulkSyncing = false
    if (this.augurNodeController == null || !this.augurNodeController.isRunning()) return
    log.info('Calling Augur Node Controller Shutdown')
    this.augurNodeController.shutdown()
    setTimeout(() => this.disconnectServerMessage(), 1000) // give augur node time to shutdown
  } catch (err) {
    log.error(err)
    this.disconnectServerMessage()
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: UNEXPECTED_ERR,
      message: err.message
    })
  }
}

AugurNodeServer.prototype.sendMsgToWindowContents = function(msg, payload) {
  try {
    if (this.window && msg) this.window.webContents.send(msg, payload)
  } catch (err) {
    log.error(err)
  }
}

AugurNodeServer.prototype.importWarpSyncFile = function(event, filename) {
  try {
    console.log('importWarpSyncFile called', filename)
    if (filename) {
      this.shutDownServer()
      console.log('calling controller warpSync method')
      this.augurNodeController.warpSync(
        filename,
        err => {
          console.log('augurNodeServer:', err.message)
          this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
            messageType: UNEXPECTED_ERR,
            message: err.message
          })
        },
        (err, message) => {
          this.sendMsgToWindowContents(INFO_NOTIFICATION, {
            messageType: GEN_INFO,
            message: message
          })
        }
      )
    }
  } catch (err) {
    log.error(err)
    this.disconnectServerMessage()
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: UNEXPECTED_ERR,
      message: err.message
    })
  }
}

module.exports = AugurNodeServer
