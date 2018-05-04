import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import dotProp from 'dot-prop-immutable-chain'
import './index.css'

import Ad from './index'
import AdDetails from './AdDetails'
import {ImgLoader, HeaderLoader, TextLoader, CardLoader} from '../Loaders'

import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

import Img from '../Img'
// import Image from "react-graceful-image";

import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card'

class AdCard extends Component {
  static propTypes = {
    ad: PropTypes.object.isRequired,
    onReload: PropTypes.func.isRequired,
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


  cut = (text = '', max) => {
    return text.substr(0, max) + (text.length > max ? '...' : '')
  }

  render() {
    const {ad, onReload} = this.props
/*
    if (!ad.eth.loaded) {
      return (
        <div className="AdCard">
        <Card>
          <CardLoader />
          </Card>
        </div>
      )
    }*/

    const bzzLoaded = ad.bzz.loaded

    const {user = '', createdAt} = ad.eth.data
    const {header, text = '', photos = []} = ad.bzz.data

    const userShort = '@' + user.substr(2, 2) + '...' +  user.substr(38)
    const photo = photos[0]

    const date = createdAt ? moment(createdAt * 1000).fromNow() : ''
console.log('render AdCard')
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
            subheader={`Published: ${date}`}
            classes={{
              title: 'card-header'
            }}
          />

          {(!bzzLoaded || (bzzLoaded && photo))
            ?
              <div className="img-fill">
                {bzzLoaded ?
                    <Img
                       src={`http://swarm-gateways.net/bzzr:/${photo}`}
                       alt={header}
                       loader={<ImgLoader />}
                     />
                  :
                    <ImgLoader animate={!ad.bzz.error} />
                }
              </div>
            :
              null
          }

          {bzzLoaded ?
              <CardContent>
                <Typography variant="title" component="h2">{this.cut(header, 25)}</Typography>
                <br/>
                <Typography paragraph>{this.cut(text, 140)}</Typography>
              </CardContent>
            :
              <CardContent>
                <HeaderLoader animate={!ad.bzz.error} />
                <TextLoader animate={!ad.bzz.error} />
                {ad.bzz.error ?
                  <div className="retry-link">
                    <a href="" onClick={onReload}>Reload ad</a>
                  </div> :
                  null
                }
              </CardContent>
          }





          <CardActions disableActionSpacing={true}>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
            <IconButton>
              <ArrowUpwardIcon />
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
