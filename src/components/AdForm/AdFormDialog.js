import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import dotProp from 'dot-prop-immutable-chain'

import './index.css'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'

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

        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => this.form.dispatchEvent(new Event('submit'))} disabled={Boolean(loading)}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>
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
