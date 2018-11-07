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
    this.saveConnection = this.saveConnection.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialConnection !== this.props.initialConnection) {
      const connection = {
        name: this.props.initialConnection ? this.props.initialConnection.name : '',
        http: this.props.initialConnection ? this.props.initialConnection.http : '',
        name: this.props.initialConnection ? this.props.initialConnection.ws : '',
        userCreated: true,
        selected: this.props.initialConnection ? this.props.initialConnection.selected : false,
      }
      this.setState({connection: connection})
    }
  }

  saveConnection(e) {
    this.props.updateConfig({uiPort: this.state.uiPort})
    this.closeModal(e)
    e.stopPropagation()
  }

  updateField(value) {
    if (value < 0 || isNaN(value) || !(/^\d+$/.test(value))) {
      this.setState({validations: {
        uiPort: 'UI Port must be a whole, positive number'
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
              <button className={Styles.ModalEditUiPort__save} onClick={this.saveConnection} disabled={!enableButton}>Save</button>
          </div>
        </div>
      </section>
    )
  }
}
