import React, {Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import './index.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import {CircularProgress} from 'material-ui/Progress'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu, { MenuItem } from 'material-ui/Menu'

import Ad from '../Ad'

import {getColumnAds} from '../../store/actions'

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

  async componentWillMount() {
    const {id, dispatch} = this.props

    window.addEventListener('resize', this.onResize)

    await dispatch(getColumnAds(id))
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

  render() {
    let {ads, loading, type, param} = this.props.column

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
                      {type} {param ? `: ${param}` : ''}
                    </Typography>

                    <IconButton  onClick={this.handleMenu}>
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
                      <MenuItem onClick={(e) => { this.handleClose(e)}}>Remove</MenuItem>
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
    column: state.columns.byId[ownProps.id]
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
