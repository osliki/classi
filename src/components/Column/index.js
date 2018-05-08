import React, {Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {account} from '../../provider'
import {getUserShort} from '../../utils'
import './index.css'

import {CircularProgress} from 'material-ui/Progress'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu, { MenuItem } from 'material-ui/Menu'

import PerfectScrollbar from 'react-perfect-scrollbar'
import Ad from '../Ad'

import {getColumnAds, removeColumn} from '../../store/actions'

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
  }

  componentWillMount() {
    const {onInit} = this.props

    window.addEventListener('resize', this.onResize)

    onInit()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
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

  getHeader = () => {
    const {column, cats} = this.props
    const {type, param} = column

    switch(type) {
      case 'user':
        if (param === account) return 'my'

        return getUserShort(param)

      case 'cat':
        return cats[param] ? cats[param].name : ''

      default:
        param
    }
    return
  }

  render() {
    const {removeColumn, column, id} = this.props
    const {ads, loading, type} = column

    const header = this.getHeader()

    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <section className="Column">
        <div className="scrl" style={{height: this.state.winHeight}}>

          {loading
            ?
              <CircularProgress />
            :
              <PerfectScrollbar option={{suppressScrollX: true}}>
                <AppBar position="sticky" color="default">
                  <Toolbar>
                    <Typography noWrap variant="subheading" style={{flex: 1}}>
                      {type}{header ? `: ${header}` : ''}
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

                {ads.map(id => (
                  <Ad key={id} id={id} view="card" />
                ))}
              </PerfectScrollbar>
          }

        </div>
      </section>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    column: state.columns.byId[ownProps.id],
    cats: state.cats
  }
}, (dispatch, ownProps) => {
  const columnId = ownProps.id

  return {
    onInit: () => {
      dispatch(getColumnAds(columnId))
    },
    removeColumn: () => {
      dispatch(removeColumn(columnId))
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
