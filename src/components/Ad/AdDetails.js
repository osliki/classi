import React, { Component } from 'react'
import './index.css'
import PropTypes from 'prop-types'
import moment from 'moment'
import {cut, getUserShort} from '../../utils'

import { CircularProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import EditIcon from '@material-ui/icons/Edit'
import BlockIcon from '@material-ui/icons/Block'
import Tooltip from 'material-ui/Tooltip'
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card'

import {ImgMiddleLoader} from '../Loaders'
import ImageZoom from 'react-medium-image-zoom'
import Img from '../Img'
import UserName from '../UserName'
import Comments from '../Comments'

class AdDetails extends Component {
  static propTypes = {
    ad: PropTypes.object.isRequired,
    onReload: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    catName: PropTypes.string.isRequired,
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
  }

  render() {
    const {ad, onZoom, onUnzoom, catName, onRemoveFav, onAddFav, onUp, isFav, onEdit, onAddToBL, isBlacklisted, onRemoveFromBL, account} = this.props
    const ethError = ad.eth.error
    const bzzLoaded = ad.bzz.loaded

    const {user = '', createdAt, updatedAt, cmntsCnt = 0} = ad.eth.data
    const {header, text = '', photos = []} = ad.bzz.data

    const isAuthor = (account.address && account.address === user)
    const userShort = isAuthor ? 'me' : getUserShort(user)

    const photo = photos[0]

    const createdAtFrom = createdAt ? moment(createdAt * 1000).fromNow() : '...'
    const updatedAtFrom = updatedAt ? moment(updatedAt * 1000).fromNow() : '...'

    const createdAtUsual = createdAt ? moment(createdAt * 1000).calendar() : '...'
    const updatedAtUsual = updatedAt ? moment(updatedAt * 1000).calendar() : '...'

    if (isBlacklisted)
      return (
        <Paper className="AdDetails">
          <Typography>
            <i>This Ad has been blacklisted.</i> <a href="#" onClick={e => {e.preventDefault(); onRemoveFromBL()}}>Undo</a>
          </Typography>
        </Paper>
      )

    return (
      <Paper className="AdDetails">
        {!bzzLoaded ?
          (ethError ?
            ethError.message
          :
            <div className="circ-progress">
              <CircularProgress size={30} />
            </div>
          )
        :
          <div>

            <div className="AdDetails-header">
              <Typography className="AdDetails-info" noWrap component="div" color="textSecondary">
                <div>
                  <span title={createdAtUsual}>
                    {`${createdAtFrom}`}
                  </span>

                   {createdAt === updatedAt ? '' : ` (edited ${updatedAtFrom})`}
                </div>
                <div>
                  {'User: '} <UserName user={user} />
                </div>
                <br />
              </Typography>

            </div>

            <Typography variant="headline" component="h1">
              {header}
            </Typography>

            <br/>
            <div className="img-list">
              {photos.map((hash, index) => (
                <div className="img-item" key={index}>
                  <Img
                    hash={hash}
                    src={`https://ipfs.io/ipfs/${hash}`}
                    loader={<ImgMiddleLoader />}
                    loaded={(src) => (
                      <ImageZoom
                        image={{src}}
                        zoomImage={{src}}
                        zoomMargin={10}
                        defaultStyles={{
                          zoomContainer: {zIndex: 999999},
                          overlay: {opacity: 0}
                        }}
                        onZoom={onZoom}
                        onUnzoom={onUnzoom}
                      />
                    )}
                  />
                </div>
              ))}
            </div>

            <br/>

            <Typography component="pre">
              {text}
            </Typography>

            <br />

            <Typography noWrap variant="body1" color="textSecondary">
              {`Category: ${catName ? catName : '...'}`}
            </Typography>

            <div className="AdDetails-actions">
              <Tooltip title="Add to Favorites">
                <IconButton onClick={() => {isFav ? onRemoveFav() :  onAddFav()}}>
                  <FavoriteIcon color={isFav ? 'error' :  'action'} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Raise Ad in Category">
                <IconButton onClick={onUp}>
                  <ArrowUpwardIcon />
                </IconButton>
              </Tooltip>

              {isAuthor
                ?
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(ad)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                :
                  <Tooltip title="Add to Blacklist">
                    <IconButton onClick={onAddToBL}>
                      <BlockIcon />
                    </IconButton>
                  </Tooltip>
              }
            </div>
            <Typography variant="subheading">
              Comments ({cmntsCnt}):
            </Typography>

            <Comments adId={ad.id} />
          </div>
        }
      </Paper>
    )
  }
}

export default AdDetails
