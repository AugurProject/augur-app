import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalEditUiPort from "../components/modal-edit-ui-port/modal-edit-ui-port";
import { updateModal } from "../actions/update-modal";
import { MODAL_DELETE_CONNECTION } from "../constants/modal-types";

import { closeModal } from "../actions/close-modal";
import { addUpdateConnection } from "../../../../app/actions/configuration";
import { updateConfig } from "../../../../app/actions/configuration"

const mapStateToProps = state => ({
  uiPort: state.configuration.uiPort,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  updateConfig: uiPort => dispatch(updateConfig(uiPort)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalEditUiPort)
);
