import React, { Component } from 'react'
import {connect} from 'react-redux'

import './index.css'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import {FormHelperText} from 'material-ui/Form'

import AdForm from './index'

import {closeAdForm} from '../../store/actions'

class AdFormDialog extends Component {

  render() {
    const {draftId, opened, onClose, loading} = this.props
    // const {loading} = draft

    console.log('RENDER AdFormDialog')

    return (
      <Dialog
        open={opened}
        onClose={onClose}
      >
        <DialogTitle>Ad Form</DialogTitle>

        <DialogContent>
          <DialogContentText>
          </DialogContentText>

          <AdForm draftId={draftId} formRef={el => this.form = el} />

        </DialogContent>

        <DialogActions style={{flexWrap: 'wrap'}}>
          <Button onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={() => this.form.dispatchEvent(new Event('submit', {cancelable: true}))}    disabled={Boolean(loading)}>
            {loading ? 'Waiting...' : 'Submit'}
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
    let loading = false
    try {
      loading = state.drafts[state.adForm.draftId].loading
    } catch(error) {}

    return {
      draftId: state.adForm.draftId,
      opened: state.adForm.opened,
      loading: loading//dotProp(state).get(`drafts.${state.adForm.draftId}.loading`, false).value()
    }
  }, (dispatch, ownProps) => {
    return {
      onClose: () => {
        dispatch(closeAdForm())
      }
    }
})(AdFormDialog)
