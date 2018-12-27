import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalWarpSync from "../components/modal-warp-sync/modal-warp-sync";

import { closeModal } from "../actions/close-modal";
import { importWarpSyncFile } from "../../../../app/actions/local-server-cmds"

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  importWarpSyncFile: filename => importWarpSyncFile(filename),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalWarpSync)
);
