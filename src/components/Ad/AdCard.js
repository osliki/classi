import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import {cut, getUserShort} from '../../utils'
import './index.css'

import {ImgLoader, HeaderLoader, TextLoader, CardLoader} from '../Loaders'
import Img from '../Img'

import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Menu, { MenuItem } from 'material-ui/Menu'

// import Image from "react-graceful-image";



class AdCard extends Component {
  static propTypes = {
    ad: PropTypes.object.isRequired,
    onReload: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onShowAdDetails: PropTypes.func.isRequired,
    catName: PropTypes.string.isRequired
  }

  static defaultProps  = {
    catName: ''
  }

  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null
    }
  }

  cut = (text = '', max) => {
    return text.substr(0, max) + (text.length > max ? '...' : '')
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const {ad, onReload, onEdit, catName} = this.props

    const bzzLoaded = ad.bzz.loaded

    const onShowAdDetails = () => {
      if (bzzLoaded && !ad.bzz.error) this.props.onShowAdDetails()
    }

    const {user = '', createdAt} = ad.eth.data
    const {header, text = '', photos = []} = ad.bzz.data

    const userShort = getUserShort(user)
    const photo = photos[0]

    const date = createdAt ? moment(createdAt * 1000).fromNow() : '...'

    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className="AdCard">

        <Card>
          <CardHeader
            action={
              <div>
                <IconButton  onClick={this.handleMenu} style={{display: bzzLoaded ? 'inherit' : 'none'}}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Show user`s ads</MenuItem>
                  <MenuItem onClick={this.handleClose}>Add user to Blacklist</MenuItem>
                  <MenuItem onClick={(e) => {onReload(); this.handleClose(e)}}>Reload</MenuItem>
                  <MenuItem onClick={(e) => {onEdit(ad); this.handleClose(e)}}>Edit</MenuItem>
                </Menu>
             </div>
           }

            subheader={
              <span>
                {`${date}`}
                <br/>
                {`User: ${userShort}`}
              </span>
            }
            classes={{
              title: 'card-header'
            }}
          />

          {(!bzzLoaded || (bzzLoaded && photo))
            ?
              <div className="img-cover" onClick={onShowAdDetails}>
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
            <CardContent onClick={onShowAdDetails} classes={{root: 'card-content'}}>
              <Typography noWrap variant="title" component="h2">{header}</Typography>
              <br/>
              <Typography paragraph>{cut(text, 140)}</Typography>
            </CardContent>
          :
            <CardContent>
              <HeaderLoader animate={!ad.bzz.error} />
              <TextLoader animate={!ad.bzz.error} />
              {ad.bzz.error ?
                <div className="retry-link">
                  <a href="#" onClick={onReload}>Reload</a>
                </div> :
                null
              }
            </CardContent>
          }

          <CardContent classes={{root: 'card-content'}}>
            <Typography noWrap variant="body1" color="textSecondary">
              {`Category: ${catName ? catName : '...'}`}
            </Typography>
          </CardContent>

          <CardActions disableActionSpacing={true}>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
            <IconButton>
              <ArrowUpwardIcon />
            </IconButton>
          </CardActions>
        </Card>

      </div>
    )
  }

}


export default AdCard
