import React, { Component } from 'react'
import {connect} from 'react-redux'

import './index.css'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import {closeMetaMaskDialog} from '../../store/actions'

import metamaskImg from'./metamask.png'

const MetaMaskDialog = (props) => {
  const {opened, onClose} = props

  if (!opened) return null

  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  return (
    <Dialog
      open={opened}
      onClose={onClose}
    >
      <DialogTitle>Get MetaMask</DialogTitle>

      <DialogContent>
        <Typography>
          In order to save your data to the blockchain, this application requires the official MetaMask extension for your browser. It's absolutely FREE.
        </Typography>

        <br/>
        <br/>

        <Card classes={{root: 'requirements-card'}}>
          <CardContent>

            <div className="">
              <a href={isFirefox ?
                'https://addons.mozilla.org/firefox/addon/ether-metamask/'
              :
                'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
              } target="_blank">
                <img src={metamaskImg} alt="metamask" />

                <br/>
                <br/>

                Get MetaMask for {isFirefox ? 'Firefox' : 'Chrome'}
              </a>

            </div>
          </CardContent>

        </Card>
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
      opened: state.metaMaskDialog.opened
    }
  }, (dispatch, ownProps) => {
    return {
      onClose: () => dispatch(closeMetaMaskDialog())
    }
})(MetaMaskDialog)
