const ipPortRegex = require('ip-port-regex')
const urlRegex = require('url-regex')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from './modal-warp-sync.styles.less'

export default class ModalWarpSync extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    importWarpSyncFile: PropTypes.func.isRequired,
    downloadTorrentFile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      filename: '',
      directory: '',
      torrentId: '',
      validations: {},
      status: {}
    }

    this.closeModal = this.closeModal.bind(this)
    this.import = this.import.bind(this)
    this.downloadTorrentFile = this.downloadTorrentFile.bind(this)
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

  downloadTorrentFile() {
    const torrentId = this.state.torrentId
    let directory = document.getElementById('directory-id').files[0]
      ? document.getElementById('directory-id').files[0].path
      : ''
    if (!directory) {
      this.setState({
        validations: {
          directory: 'directory is required'
        }
      })
    } else if (!torrentId) {
      this.setState({
        validations: {
          torrentId: 'torrentId is required'
        }
      })
    } else {
      this.setState({
        status: {
          name: 'client connecting ...',
          progress: 0
        }
      })
      this.props.downloadTorrentFile(torrentId, directory, (err, status) => {
        if (err) console.log(err)
        if (status) {
          this.setState({
            status: {
              name: status.name,
              progress: Math.round(status.progress * 100)
            }
          })
        }
      })
    }
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  render() {
    const { filename, directory, torrentId, validations, status } = this.state

    return (
      <section id="warpSyncModal" className={Styles.ModalWarpSync}>
        <div className={Styles.ModalWarpSync__container}>
          <div className={Styles.ModalWarpSync__header}>
            <div className={Styles.ModalWarpSync__title}>Warp Sync File</div>
          </div>
          <div className={Styles.ModalWarpSync__subheader}>Import warp sync file.</div>
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
        <div className={Styles.ModalWarpSync__container}>
          <div className={Styles.ModalWarpSync__header}>
            <div className={Styles.ModalWarpSync__title}>Download Warp Sync File via Torrent</div>
          </div>
          <div className={Styles.ModalWarpSync__subheader}>Choose a download location.</div>
          <div className={Styles.ModalWarpSync__inputContainer}>
            <input
              className={classNames(Styles.ModalWarpSync__input, {
                [Styles['ModalWarpSync__inputError']]: validations.directory
              })}
              onChange={e => {
                this.setState({ directory: e.target.value })
              }}
              value={directory}
              type="file"
              webkitdirectory="true"
              mozdirectory="true"
              directory="true"
              id="directory-id"
              placeholder={'Directory'}
            />
            {validations.directory && <div className={Styles.ModalWarpSync__errorMessage}>{validations.directory}</div>}
          </div>
          <div className={Styles.ModalWarpSync__inputContainer}>
            <input
              className={classNames(Styles.ModalWarpSync__input, {
                [Styles['ModalWarpSync__inputError']]: validations.torrentId
              })}
              onChange={e => {
                this.setState({ torrentId: e.target.value })
              }}
              value={torrentId}
              placeholder={'TorrentId'}
            />
            {validations.torrentId && <div className={Styles.ModalWarpSync__errorMessage}>{validations.torrentId}</div>}
            {status.name && (
              <div className={Styles.ModalWarpSync__errorMessage}>
                {status.name}
                <div className={Styles.ModalWarpSync__errorMessage}>
                  {status.progress === 100 ? `finished downloading` : `${status.progress} %`}
                </div>
              </div>
            )}
          </div>
          <div className={Styles.ModalWarpSync__buttonContainer}>
            <div className={Styles.ModalWarpSync__cancel} onClick={this.closeModal}>
              Cancel
            </div>
            <button className={Styles.ModalWarpSync__save} onClick={this.downloadTorrentFile}>
              Download
            </button>
          </div>
        </div>
      </section>
    )
  }
}
