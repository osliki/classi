import React, { Component } from 'react'
import './index.css'
import PropTypes from 'prop-types'
import moment from 'moment'
import {cut, getUserShort} from '../../utils'

import { CircularProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'

import {ImgMiddleLoader} from '../Loaders'
import ImageZoom from 'react-medium-image-zoom'
import Img from '../Img'
import UserName from '../UserName'

class AdDetails extends Component {
  static propTypes = {
    ad: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {ad, onZoom, onUnzoom, catName} = this.props
    const bzzLoaded = ad.bzz.loaded

    const {user = '', createdAt, updatedAt} = ad.eth.data
    const {header, text = '', photos = []} = ad.bzz.data

    const userShort = getUserShort(user)
    const photo = photos[0]

    const createdAtFrom = createdAt ? moment(createdAt * 1000).fromNow() : '...'
    const updatedAtFrom = updatedAt ? moment(updatedAt * 1000).fromNow() : '...'

    return (
      <Paper className="AdDetails">
        { !bzzLoaded
          ?
            <CircularProgress />
          :
            <div>
              <Typography noWrap variant="body1" color="textSecondary">
                {`${createdAtFrom}`} {createdAt === updatedAt ? '' : ` (edited ${updatedAtFrom})`}
                <br />
                {'User: '} <UserName user={user} />
                <br /><br />
              </Typography>

              <Typography variant="headline" component="h1">
                {header}
              </Typography>
              <br/>
              <div className="img-list">
                {photos.map((hash, index) => (
                  <div className="img-item" key={index}>
                    <Img
                      src={`http://swarm-gateways.net/bzzr:/${hash}`}
                      loader={<ImgMiddleLoader />}
                      loaded={(
                        <ImageZoom
                          image={{
                            src: `http://swarm-gateways.net/bzzr:/${hash}`
                          }}
                          zoomImage={{
                            src: `http://swarm-gateways.net/bzzr:/${hash}`
                          }}
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
            </div>
        }
      </Paper>
    )
  }
}

export default AdDetails
