import React, {Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import dotProp from 'dot-prop-immutable-chain'
import throttle from 'lodash/throttle'
import {getUserShort} from '../../utils'
import './index.css'

import {CircularProgress} from 'material-ui/Progress'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ClearIcon from '@material-ui/icons/Clear'
import RefreshIcon from '@material-ui/icons/Refresh'
import FiberNewIcon from '@material-ui/icons/FiberNew'
import Menu, {MenuItem} from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import Tooltip from 'material-ui/Tooltip'

import PerfectScrollbar from 'react-perfect-scrollbar'
import Ad from '../Ad'

import {getColumnAds, removeColumn, refreshColumn, purgeAds, checkNewAds} from '../../store/actions'

class Column extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    column: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
      winHeight: document.body.clientHeight
    }

    window.addEventListener('resize', this.onResize)

    const {getColumnAds, checkNewAds, column} = this.props

    getColumnAds()

    if (column.type !== 'fav')
      this.interval = setInterval(() => {
        !this.props.column.loading && checkNewAds() // to prevent show newAds button before loading first ads
      }, 3000)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)

    this.interval && clearInterval(this.interval)
  }

  onResize = () => {
    this.setState({winHeight: document.body.clientHeight})
  }

  handleMenu = (e) => {
    this.setState({anchorEl: e.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  getNewAds = () => {
    this.props.getNewAds()
    this._scrollRef.scrollTop = 0
  }

  getHeader = () => {
    const {column, cats, address} = this.props
    const {type, param = ''} = column

    switch(type) {
      case 'user':
        if (param === address) return 'my'

        return getUserShort(param)

      case 'cat':
        return cats[param] ? cats[param].name : ' '

      default:
        param
    }
    return
  }

  onYReachEnd = () => {
    console.log('onYReachEnd')
    const {loading, ads, total} = this.props.column

    if (total === ads.length || loading /* || !ads.length*/) return // loading insted of ads.length

    console.log('onYReachEnd', this.props.column)//!!!!!!!!!!!
    this.props.getColumnAds()
  }

  render() {
    const {getNewAds} = this
    const {removeColumn, column, id, favs, refreshColumn} = this.props
    const {loading, type, error, newAdsCount = 0} = column

    // const ads = column.ads
    // const total = column.total

    const ads = (type === 'fav' ? favs : column.ads)
    const total = (type === 'fav' ? favs.length : column.total)

    const header = this.getHeader()

    const {anchorEl} = this.state
    const open = Boolean(anchorEl)

    console.log('Render Column', column)

    return (
      <section className="Column">

        <AppBar position="sticky" color="default">
          <Toolbar disableGutters classes={{root: 'column-header'}}>
            <Typography noWrap variant="subheading" style={{flex: 1}}>
              {type}({total}){header ? `: ${header}` : ''}
            </Typography>

              {newAdsCount > 0
                ?
                  <Tooltip title={`Load new ads (${newAdsCount})`}>
                    <div>
                      <IconButton disabled={Boolean(loading)} onClick={loading ? null : getNewAds}>
                        <FiberNewIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                :
                  null
              }

              {type === 'fav'
                ?
                  null
                :
                  <Tooltip title="Refresh column">
                    <div>
                      <IconButton disabled={Boolean(loading)} onClick={loading ? null : refreshColumn}>
                        <RefreshIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
              }

              <Tooltip title="Remove column">
                <IconButton onClick={removeColumn}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>

          </Toolbar>
        </AppBar>

        <div className="scrl" style={{height: this.state.winHeight-120}}>

          <PerfectScrollbar
            option={{suppressScrollX: true}}
            onYReachEnd={type === 'fav' ? undefined : this.onYReachEnd}
            containerRef={el => this._scrollRef = el}
          >
            {(error
              ?
                <Typography align="center" style={{flex: 1}}>
                  <br/><br/>
                  Something went wrong :(
                  <br/>
                  <br/>
                  <small>{error.message}</small>
                </Typography>
              :
                (ads.length
                  ?
                    ads.map(id => {
                      return (
                        <Ad key={id} id={id} view="card" />
                      )
                    })
                  :
                    (loading
                      ?
                        null
                      :
                        <Typography align="center" style={{flex: 1}}>
                          <br/><br/>
                          Ads not found
                        </Typography>
                    )
                )
            )}

            {loading
              ?
                <div className="circ-progress">
                  <CircularProgress size={18} />
                </div>
              :
                null
            }

          </PerfectScrollbar>

        </div>
      </section>
    )
  }
}

const emptyFavs = []

export default connect((state, ownProps) => {
  const column = state.columns.byId[ownProps.id]

  return {
    column: column,
    cats: state.cats.byId,
    favs: column.type === 'fav' ? state.favs : emptyFavs,
    address: state.account.address
  }
}, (dispatch, ownProps) => {
  const columnId = ownProps.id

  return {
    getColumnAds: () => {
      dispatch(getColumnAds(columnId))
    },
    removeColumn: () => {
      dispatch(removeColumn(columnId))
      dispatch(purgeAds())
    },
    refreshColumn: () => {
      dispatch(refreshColumn(columnId))
    },
    getNewAds: () => {
      dispatch(getColumnAds(columnId, 'new'))
    },
    checkNewAds: () => {
      dispatch(checkNewAds(columnId))
    }
  }
})(Column)



/*
  const adsCount = await contract.methods.getAdsCount().call()

  let promises = []

  let minId = adsCount - 1 - 3
  if (minId < 0)
    minId = 0

  for (let id = adsCount - 1; id >= minId; id--) {
    promises.push(contract.methods.ads(id).call())
  }

  const ads = await Promise.all(promises)

  this.setState(prevState => {
    return {
      ads: [...ads, ...prevState.ads]
    }
  })*/
/*
            <AppBar color="default">
              <Toolbar>
                <Typography noWrap variant="subheading" style={{flex: 1}}>
                  {type}({total}){header ? `: ${header}` : ''}
                </Typography>

                <IconButton onClick={this.handleMenu}>
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
                  <MenuItem onClick={(e) => { this.handleClose(e); removeColumn(id); }}>Remove</MenuItem>
                </Menu>

              </Toolbar>
            </AppBar>
*/
