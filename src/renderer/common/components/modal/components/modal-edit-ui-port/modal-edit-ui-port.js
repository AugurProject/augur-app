const ipPortRegex = require("ip-port-regex");
const urlRegex = require("url-regex");

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "./modal-edit-ui-port.styles.less";
import ModalDeleteConnection from "../../containers/modal-delete-connection";

export default class ModalEditUiPort extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    updateConfig: PropTypes.func.isRequired,
    uiPort: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      uiPort: props.uiPort,
      validations: {},
    };

    this.closeModal = this.closeModal.bind(this)
    this.updateField = this.updateField.bind(this)
    this.save = this.save.bind(this)
  }

  save(e) {
    this.props.updateConfig({uiPort: this.state.uiPort})
    this.closeModal(e)
    e.stopPropagation()
  }

  updateField(value) {
    if (value < 0 || value >= 65536 || isNaN(value) || !(/^\d+$/.test(value))) {
      this.setState({validations: {
        uiPort: 'Must be a whole number, between zero and 65536'
      }})
    } else {
      this.setState({validations: {}})
    }
    
    this.setState({uiPort: value})
  }

  closeModal(e) {
    this.props.closeModal()
    e.stopPropagation()
  }

  render() {
    const { initialConnection } = this.props;
    const {
      uiPort,
      validations,
    } = this.state

    let enableButton = uiPort !== ''
    if (validations.uiPort) {
      enableButton = false
    }
    return (
      <section id="editUiPortModal" className={Styles.ModalEditUiPort}>
        <div className={Styles.ModalEditUiPort__container}>
          <div className={Styles.ModalEditUiPort__header}>
            <div className={Styles.ModalEditUiPort__title}>Edit UI Port</div>
          </div>
          <div className={Styles.ModalEditUiPort__subheader}>
            Edit the UI port to run Augur on a different port (default is 8080)
          </div>
          <div className={Styles.ModalEditUiPort__label}>
              UI Port
          </div>
          <div className={Styles.ModalEditUiPort__inputContainer}>
              <input
                  onChange={e => {
                    this.updateField(e.target.value);
                  }}
                  className={classNames(Styles.ModalEditUiPort__input, {
                     [Styles['ModalEditUiPort__inputError']]: validations.uiPort
                  })}
                  value={uiPort}
              />
              {validations.uiPort &&
                <div className={Styles.ModalEditUiPort__errorMessage}>{validations.uiPort}</div>
              }
          </div>          
          <div className={Styles.ModalEditUiPort__buttonContainer}>
              <div className={Styles.ModalEditUiPort__cancel} onClick={this.closeModal}>Cancel</div>
              <button className={Styles.ModalEditUiPort__save} onClick={this.save} disabled={!enableButton}>Save</button>
          </div>
        </div>
      </section>
    )
  }
}
