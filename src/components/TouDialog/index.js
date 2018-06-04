import React, { Component } from 'react'
import {connect} from 'react-redux'

// import './index.css'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import {closeTouDialog} from '../../store/actions'

const TouDialog = (props) => {
  const {opened, onClose} = props

  if (!opened) return null

  return (
    <Dialog
      open={opened}
      onClose={onClose}
    >
      <DialogTitle>Terms of Use</DialogTitle>

      <DialogContent>
          <DialogContentText>
            1. You are aware that Osliki Classifieds is a decentralized application and that, consequently, content published on this app is not under control of any legal entity or private individual. Accordingly, you may not fully delete any content published here, and that removed content persist without any time limitation and may still be available to others.
          </DialogContentText>

          <br/>

          <DialogContentText>
            2. You understand and expressly accept that there is no warranty whatsoever regarding the availability and functionality of Osliki Classifieds, and that the current release is used at the sole risk of yourself on an “as is” basis and without, to the extent permitted by law, any warranties of any kind, including, but not limited to, warranties of title or implied warranties, merchantability or fitness for a particular purpose;
          </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )

}

export default connect((state, ownProps) => {
    return {
      opened: state.touDialog.opened
    }
  }, (dispatch, ownProps) => {
    return {
      onClose: () => dispatch(closeTouDialog())
    }
})(TouDialog)
