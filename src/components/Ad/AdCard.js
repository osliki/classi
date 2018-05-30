import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {cut, getUserShort} from '../../utils'
import './index.css'

import {ImgLoader, HeaderLoader, TextLoader} from '../Loaders'
import Img from '../Img'

import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatIcon from '@material-ui/icons/ChatBubbleOutline'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import Tooltip from 'material-ui/Tooltip'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Card, {CardHeader, CardActions, CardContent} from 'material-ui/Card'
import Menu, {MenuItem} from 'material-ui/Menu'

class AdCard extends Component {
  static propTypes = {
    ad: PropTypes.object.isRequired,
    onReload: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onShowAdDetails: PropTypes.func.isRequired,
    catName: PropTypes.string.isRequired,
    onShowUser: PropTypes.func.isRequired,
    onAddFav: PropTypes.func.isRequired,
    onRemoveFav: PropTypes.func.isRequired,
    isFav: PropTypes.bool.isRequired,
    onUp: PropTypes.func.isRequired,
    onAddToBL: PropTypes.func.isRequired,
    onRemoveFromBL: PropTypes.func.isRequired,
    isBlacklisted: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
  }

  static defaultProps  = {
    catName: '',
    isFav: false,
    isBlacklisted: false,
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
    const {ad, onReload, onEdit, catName, onShowUser, onAddFav, onRemoveFav, isFav, onUp, onAddToBL, onRemoveFromBL, isBlacklisted, account} = this.props

    const bzzLoaded = ad.bzz.loaded

    const onShowAdDetails = () => {
      if (bzzLoaded && !ad.bzz.error) this.props.onShowAdDetails()
    }

    const {user = '', createdAt, cmntsCnt = 0, text:hash = ''} = ad.eth.data
    const {header, text = '', photos = []} = ad.bzz.data

    const isAuthor = (account.address && account.address === user)
    const userShort = isAuthor ? 'me' : getUserShort(user)

    const photo = photos[0]

    const dateFrom = createdAt ? moment(createdAt * 1000).fromNow() : '...'
    const dateUsual = createdAt ? moment(createdAt * 1000).calendar() : '...'

    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    console.log('RENDER AdCard', ad)

    if (isBlacklisted)
      return (
        <div className="AdCard">
          <Card>
            <CardHeader />

            <CardContent>
              <Typography>
                <i>This Ad has been blacklisted.</i> <a href="#" onClick={(e) => {e.preventDefault(); onRemoveFromBL()}}>Undo</a>
              </Typography>
            </CardContent>
          </Card>
        </div>)

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
                  <MenuItem onClick={(e) => {onShowUser(ad.eth.data.user); this.handleClose(e)}}>Show user`s ads</MenuItem>
                  <MenuItem onClick={(e) => {onReload(); this.handleClose(e)}}>Reload</MenuItem>
                  {isAuthor
                    ?
                      <MenuItem onClick={(e) => {onEdit(ad); this.handleClose(e)}}>Edit</MenuItem>
                    :
                      <MenuItem onClick={(e) => {onAddToBL(); this.handleClose(e)}}>Add to Blacklist</MenuItem>
                  }
                </Menu>
             </div>
           }

            subheader={
              <div>
                <div title={dateUsual}>
                  {`${dateFrom}`}
                </div>

                <div title={user}>
                  {`User: ${userShort}`}
                </div>
              </div>
            }
            classes={{
              title: 'card-header'
            }}
          />

          {(!bzzLoaded || (bzzLoaded && photo))
            ?
              <div title={photo ? `Photo /ipfs/${photo}` : ''} className="img-cover" onClick={onShowAdDetails}>
                {bzzLoaded ?
                    <Img
                      hash={photo}
                      src={`https://ipfs.io/ipfs/${photo}`}
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
            <CardContent title={`Text /ipfs/${hash}`} onClick={onShowAdDetails} classes={{root: 'card-content'}}>
              <Typography noWrap variant="title" component="h2">{header}</Typography>
              <br/>
              <Typography paragraph>{cut(text, 140)}</Typography>
            </CardContent>
          :
            <CardContent title={`Text /ipfs/${hash}`} classes={{root: 'card-content-loader'}}>
              <HeaderLoader animate={!ad.bzz.error} />
              <br/>
              <br/>
              <TextLoader animate={!ad.bzz.error} />
              {ad.bzz.error ?
                <div className="retry-link">
                  <a href="#" onClick={onReload}>Reload</a>
                </div>
              :
                null
              }
            </CardContent>
          }

          <CardContent classes={{root: 'card-content-cat'}}>
            <Typography noWrap variant="body1" color="textSecondary" title={catName}>
              {`Category: ${catName ? catName : '...'}`}
            </Typography>
          </CardContent>

          <CardActions disableActionSpacing={true}>
            <Tooltip title="Add to Favorites">
              <IconButton onClick={() => {isFav ? onRemoveFav() :  onAddFav()}}>
                <FavoriteIcon color={isFav ? 'error' :  'action'} />
              </IconButton>
            </Tooltip>

            {isAuthor ?
              <Tooltip title="Raise Ad in Category">
                <IconButton onClick={onUp}>
                  <ArrowUpwardIcon />
                </IconButton>
              </Tooltip>
            :
              null
            }

            <div className="comment-icon-wrapper">
              <Typography component="span" className="comment-icon" onClick={this.props.onShowAdDetails} title={`Comments ${cmntsCnt}`}>
                <ChatIcon/>: {cmntsCnt}
              </Typography>
            </div>

          </CardActions>
        </Card>

      </div>
    )
  }

}


export default AdCard
