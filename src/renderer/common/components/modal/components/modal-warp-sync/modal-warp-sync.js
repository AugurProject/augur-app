const ipPortRegex = require('ip-port-regex')
const urlRegex = require('url-regex')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from './modal-warp-sync.styles.less'

export default class ModalWarpSync extends Component {
  static propTypes = {
    dataDir: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    importWarpSyncFile: PropTypes.func.isRequired,
    openFolderBrowser: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      filename: '',
      directory: '',
      fileUri: '',
      validations: {},
      status: {}
    }

    this.closeModal = this.closeModal.bind(this)
    this.import = this.import.bind(this)
    this.openFolderBrowserClick = this.openFolderBrowserClick.bind(this)
  }

  import(e) {
    const filename = document.getElementById('file-id').files[0] ? document.getElementById('file-id').files[0].path : ''
    if (!filename) {
      this.setState({
        validations: {
          filename: 'filename is required'
        }
      })
    } else {
      this.closeModal(e)
      this.props.importWarpSyncFile(filename)
    }
  }

  openFolderBrowserClick() {
    this.props.openFolderBrowser(this.props.dataDir)
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  render() {
    const { dataDir } = this.props
    const { filename, validations } = this.state

    return (
      <section id="warpSyncModal" className={Styles.ModalWarpSync}>
        <div className={Styles.ModalWarpSync__container}>
          <div className={Styles.ModalWarpSync__header}>
            <div className={Styles.ModalWarpSync__title}>Augur Warp Sync</div>
          </div>
          <div className={Styles.ModalWarpSync__subheader}>
            <div className={Styles.ModalWarpSync__subTitle}>Access and Share</div>
            <div className={Styles.ModalWarpSync__explanation}>
              Warp Sync file is already processed market data. A warp sync file is updated every 100 blocks. Send this file to someone to quickly get them synced and save them hours. File is named `&lt;md5_hash&gt;.&lt;network_id&gt;.&lt;db_version&gt;.warp`
            </div>
          </div>
          <div className={Styles.ModalWarpSync__inputContainer}>
            <div className={Styles.ModalWarpSync__label}>Warp Sync File location: {dataDir}</div>
            <div className={Styles.ModalWarpSync__buttonContainer}>
              <button className={Styles.ModalWarpSync__save} style={{marginLeft: 0}} onClick={this.openFolderBrowserClick}>Open Location</button>
            </div>
          </div>
          <div className={Styles.ModalWarpSync__subContainer}>
          <div className={Styles.ModalWarpSync__subheader}>
            <div className={Styles.ModalWarpSync__subTitle}>Import Warp Sync File</div>
            <div className={Styles.ModalWarpSync__explanation}>
              The import process will backup existing market data then replace with imported warp sync file.
            </div>
          </div>
            <div className={Styles.ModalWarpSync__inputContainer}>
              <input
                className={classNames(Styles.ModalWarpSync__input, {
                  [Styles['ModalWarpSync__inputError']]: validations.filename
                })}
                onChange={e => {
                  this.setState({ filename: e.target.value })
                }}
                value={filename}
                type="file"
                id="file-id"
                placeholder={'Filename'}
              />
              {validations.filename && <div className={Styles.ModalWarpSync__errorMessage}>{validations.filename}</div>}

              <div className={Styles.ModalWarpSync__warningMessage}>
                <span>Warning:</span> To expedite the process of syncing Augur's database with the Ethereum blockchain, Augur can import a sync file containing already processed market data. Please verify that you trust the source of this file before importing.
              </div>
            </div>
            <div className={Styles.ModalWarpSync__buttonContainer}>
              <div className={Styles.ModalWarpSync__cancel} onClick={this.closeModal}>
                Cancel
              </div>
              <button className={Styles.ModalWarpSync__save} onClick={this.import}>
                Import
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
