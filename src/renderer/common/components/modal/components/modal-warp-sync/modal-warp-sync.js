const ipPortRegex = require("ip-port-regex");
const urlRegex = require("url-regex");

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "./modal-warp-sync.styles.less";

export default class ModalWarpSync extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    importWarpSyncFile: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      filenmae: '',
      validations: {},
    };

    this.closeModal = this.closeModal.bind(this)
    this.import = this.import.bind(this)
  }

  import(e) {
    const filename = document.getElementById("file-id").files[0] ? document.getElementById("file-id").files[0].path : ""
    if (!filename) {
      this.setState({validations: {
        filename: 'filename is required'
      }})
    } else {
      this.closeModal(e);
      this.props.importWarpSyncFile(filename)
    }
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  render() {
    const {
      filename,
      validations,
    } = this.state

    return (
      <section id="warpSyncModal" className={Styles.ModalWarpSync}>
        <div className={Styles.ModalWarpSync__container}>
          <div className={Styles.ModalWarpSync__header}>
            <div className={Styles.ModalWarpSync__title}>Warp Sync File</div>
          </div>
          <div className={Styles.ModalWarpSync__subheader}>
            Choose a warp sync file.
          </div>
          <div className={Styles.ModalWarpSync__inputContainer}>
              <input
                  className={classNames(Styles.ModalWarpSync__input, {
                     [Styles['ModalWarpSync__inputError']]: validations.filename
                  })}
                  value={filename}
                  type="file"
                  id="file-id"
                  placeholder={"Filename"}
              />
              {validations.filename &&
                <div className={Styles.ModalWarpSync__errorMessage}>{validations.filename}</div>
              }
          </div>
          <div className={Styles.ModalWarpSync__buttonContainer}>
              <div className={Styles.ModalWarpSync__cancel} onClick={this.closeModal}>Cancel</div>
              <button className={Styles.ModalWarpSync__save} onClick={this.import}>Import</button>
          </div>
        </div>
      </section>
    )
  }
}
