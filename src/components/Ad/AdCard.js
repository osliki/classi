import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import './index.css'
import moment from 'moment'

import AdDetails from './AdDetails'
import AdCardLoading from './AdCardLoading'

import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

class AdCard extends Component {
  static propTypes = {
    ad: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      detailsShowed: false,
    }

  }

  showAdDetails = () => {
    this.setState({ detailsShowed: true })
  }

  closeAdDetails = () => {
    this.setState({ detailsShowed: false });
  }

  render() {
    const {ad} = this.props
    console.log('RENDER', ad)

    if (ad.eth.loading || ad.bzz.loading) {
      return <AdCardLoading />
    }
    const {user, createdAt} = ad.eth.data
    const {header, text, photos} = ad.bzz.data

    const date = moment(createdAt * 1000).fromNow()

    return (
      <div className="Ad">
        <h4 onClick={this.showAdDetails}>{header || ad.text}</h4>
        {photos && photos[0]
          ?
            <div className="img-fill">
              <img
                src={`http://swarm-gateways.net/bzzr:/${photos[0]}`}
                alt={`Loading img: ${photos[0]}`}
                onError={(e) => { e.target.src = e.target.src }}
              />
            </div>
          :
            <div className="empty-img">empty</div>
        }

        @{user.substr(2, 2) + '...' +  user.substr(38)}<br />
        {text}<br />
        {date}<br />

        <Dialog
          fullScreen
          open={this.state.detailsShowed}
          onClose={this.closeAdDetails}
        >
          <AdDetails ad={ad} />
          <Button onClick={this.closeAdDetails}>
            Cancel
          </Button>
        </Dialog>
      </div>
    )
  }

}

export default AdCard
