import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalWarpSync from '../components/modal-warp-sync/modal-warp-sync'

import { closeModal } from '../actions/close-modal'
import { importWarpSyncFile, openFolderBrowser } from '../../../../app/actions/local-server-cmds'

const mapStateToProps = state => ({
  dataDir: state.configuration.dataDir
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  importWarpSyncFile: filename => importWarpSyncFile(filename),
  openFolderBrowser: directory => openFolderBrowser(directory)
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalWarpSync)
)
