import React, { Component } from 'react'
import {connect} from 'react-redux'

// import './index.css'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'

import {closeApproveTokenDialog, approveToken} from '../../store/actions'

class ApproveTokenDialog extends Component {

  render() {
    const {opened, onClose, onApproveToken} = this.props

    return (
      <Dialog
        open={opened}
        onClose={onClose}
      >
        <DialogTitle>Token allowance</DialogTitle>

        <DialogContent>
          <DialogContentText>
            You need authorize this application to access your OSLIK tokens.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onApproveToken}>
            Authorize
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default connect((state, ownProps) => {
    return {
      opened: state.approveTokenDialog.opened
    }
  }, (dispatch, ownProps) => {
    return {
      onClose: () => dispatch(closeApproveTokenDialog()),
      onApproveToken: () => dispatch(approveToken())
    }
})(ApproveTokenDialog)
