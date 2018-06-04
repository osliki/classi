import React, { Component } from 'react'
import {connect} from 'react-redux'
import {web3} from '../../provider'

// import './index.css'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import {closeUpAdDialog, upAd} from '../../store/actions'

class UpAdDialog extends Component {

  render() {
    const {opened, onClose, onConfirm, upPrice, loading} = this.props

    if (!opened) return null

    return (
      <Dialog
        open={opened}
        onClose={onClose}
      >
        <DialogTitle>Up Ad</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Your ad will be duplicated and became the first in the appropriate category with saving the same public link and all comments. <strong>{web3.utils.fromWei(String(upPrice), 'ether')}</strong> OSLIK tokens will be withdrawn from your account.
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{flexWrap: 'wrap'}}>
          <Button onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={Boolean(loading)} onClick={onConfirm}>
            {loading ? 'Waiting...' : 'Confirm'}
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
      opened: state.upAdDialog.opened,
      loading: state.upAdDialog.loading,
      id: state.upAdDialog.id,
      upPrice: state.account.upPrice
    }
  }, (dispatch, ownProps) => {
    return {
      onClose: () => dispatch(closeUpAdDialog()),
      onConfirm: () => dispatch(upAd())
    }
})(UpAdDialog)
