import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

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
    const {draftId, opened, onClose} = this.props

    return (
      <Dialog
        open={opened}
        onClose={onClose}
      >
        <DialogTitle>Ad form</DialogTitle>

        <DialogContent>
          <DialogContentText>
          </DialogContentText>

          <AdForm draftId={draftId} formRef={el => this.form = el} />

        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => this.form.dispatchEvent(new Event('submit'))}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default connect((state, ownProps) => {
    return {
      draftId: state.adForm.draftId,
      opened: state.adForm.opened
    }
  }, (dispatch, ownProps) => {
    return {
      onClose: () => dispatch(closeAdForm())
    }
})(AdFormDialog)
