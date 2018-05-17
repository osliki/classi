import React, { Component } from 'react'
import {connect} from 'react-redux'

import './index.css'

import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import Ad from './index'

class AdDetailsDialog extends Component {

  render() {
    const {adId, zoom, opened, onClose} = this.props

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
      onClose: () => window.location.hash = ''
    }
})(AdDetailsDialog)


/*<Button onClick={onClose}>Close</Button>
<Typography variant="title" style={{flex: 1}}>
{dotProp(ad).get('bzz.data.header', '').value()}
</Typography>*/
