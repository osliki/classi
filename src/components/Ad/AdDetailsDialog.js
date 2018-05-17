import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import dotProp from 'dot-prop-immutable-chain'

import './index.css'

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import Ad from './index'

import {closeAd, zoomAd, unzoomAd} from '../../store/actions'

class AdDetailsDialog extends Component {

  render() {
    const {adId, zoom, opened, onClose, onZoom, onUnzoom} = this.props

//    if (!ad) return null

    return (
      <Dialog
        fullScreen
        open={opened}
        onClose={onClose}
        disableEscapeKeyDown={zoom}
      >
        <AppBar position="fixed" color="default">
          <Toolbar>
            <IconButton onClick={onClose} title="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <br/>
        <br/>

        <Ad id={adId} view="details" />
      </Dialog>
    )
  }
}

export default connect((state, ownProps) => {
    return {
      adId: state.ad.id,
      zoom: state.ad.zoom,
      opened: state.ad.opened
    }
  }, (dispatch) => {
    return {
      onClose: () => window.location.hash = '',
      onZoom: () => {
        dispatch(zoomAd())
      },
      onUnzoom: () => {
        dispatch(unzoomAd())
      }
    }
})(AdDetailsDialog)


/*<Button onClick={onClose}>Close</Button>
<Typography variant="title" style={{flex: 1}}>
{dotProp(ad).get('bzz.data.header', '').value()}
</Typography>*/
