import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import dotProp from 'dot-prop-immutable-chain'
import './index.css'
//import 'placeholder-loading/dist/css/placeholder-loading.min.css'

import Ad from './index'
import AdDetails from './AdDetails'
import AdCardLoading from './AdCardLoading'

import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

import Image from "react-graceful-image";

import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card'

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

    if (!ad.eth.loaded) {
      return (
        <div className="AdCard">
          <AdCardLoading />
        </div>
      )
    }

    const bzzLoaded = ad.bzz.loaded

    const {user = '', createdAt} = ad.eth.data
    const {header, text, photos = []} = ad.bzz.data

    const userShort = '@' + user.substr(2, 2) + '...' +  user.substr(38)
    const photo = photos[0]

    const date = createdAt ? moment(createdAt * 1000).fromNow() : ''



    return (
      <div className="AdCard">

        <Card>

          <CardHeader
           action={
             <IconButton>
               <MoreVertIcon />
             </IconButton>
            }
            title={userShort}
            subheader={date}
          />


          {photo
            ?
              <div className="img-fill">
                <Image
                   src={`http://swarm-gateways.net/bzzr:/${photo}`}
                   retry={{delay: 1, accumulate: 'add'}}
                   alt="Loading"
                   noLazyLoad
                   placeholderColor="#eee"
                 />
              </div>
            :
              (!bzzLoaded
                ?
                  <div class="ph-item">
                    <div class="ph-picture"></div>
                  </div>

                :
                  null
              )
          }

          <CardContent>
            {bzzLoaded
              ?
                <h3>{header}</h3>
              :
                <h3>placeholderHeader</h3>
            }

            {bzzLoaded
              ?
                <p>{text}</p>
              :
                <p>placeholderText</p>
            }

          </CardContent>


          <CardActions disableActionSpacing>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>


        <Dialog
          fullScreen
          open={this.state.detailsShowed}
          onClose={this.closeAdDetails}
        >
          <Ad id={ad.id} />
          <Button onClick={this.closeAdDetails}>
            Cancel
          </Button>
        </Dialog>



      </div>
    )
  }

}

export default AdCard
