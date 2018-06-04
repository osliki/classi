import React, { Component } from 'react'
import {connect} from 'react-redux'

// import './index.css'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import {getIsApprovePending} from '../../store/selectors'
import {closeApproveTokenDialog, approveToken} from '../../store/actions'

class ApproveTokenDialog extends Component {

  render() {
    const {opened, onClose, onApproveToken, loading, txs, account} = this.props

    if (!opened) return null

    const isApprovePending = getIsApprovePending({txs, account})

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

        <DialogActions style={{flexWrap: 'wrap'}}>
          <Button onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={Boolean(loading) || isApprovePending} onClick={onApproveToken}>
            {loading ? 'Waiting...' : (isApprovePending ? 'Pending...' : 'Authorize')}
          </Button>

          {loading ?
            <FormHelperText classes={{root: 'dialog-action-message'}}>
              Pay for the transaction in MetaMask
            </FormHelperText>
          :
            null
          }
        </DialogActions>
      </Dialog>
    )
  }
}

export default connect((state, ownProps) => {
    return {
      opened: state.approveTokenDialog.opened,
      loading: state.approveTokenDialog.loading,
      txs: state.transactions,
      account: state.account,
    }
  }, (dispatch, ownProps) => {
    return {
      onClose: () => dispatch(closeApproveTokenDialog()),
      onApproveToken: () => dispatch(approveToken())
    }
})(ApproveTokenDialog)
