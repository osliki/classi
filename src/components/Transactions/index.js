import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import './index.css'

import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import TrackChangesIcon from '@material-ui/icons/TrackChanges'
import Tooltip from 'material-ui/Tooltip'
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Menu, { MenuItem } from 'material-ui/Menu'
import List, { ListItem, ListItemSecondaryAction, ListItemAvatar, ListItemText } from 'material-ui/List';

import Transaction from './Transaction'

import {getTxName} from '../../utils'
import {getScannedTx} from '../../store/selectors'
import {getTxStatus, getAccount, openTxsMenu, closeTxsMenu} from '../../store/actions'

class Transactions extends Component {
  static propTypes = {
    txs: PropTypes.object.isRequired
  }

  static defaultProps  = {
    txs: {}
  }

  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null
    }
  }

  componentWillMount() {
    this.interval = setInterval(() => {
      this.props.onTxScan(this.props.txs)
    }, 5000)

    this.props.onTxScan(this.props.txs)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('componentWillUpdate', nextProps.open, Boolean(this.state.anchorEl))
    if (nextProps.open !== Boolean(this.state.anchorEl)) {
      this.setState({ anchorEl: nextProps.open ? this.buttonRef : null });
    }
  }

  handleMenu = (event) => {
    this.props.openMenu()
  }

  handleClose = () => {
    this.props.closeMenu()
  }

  render() {
    const {txs} = this.props

    const {anchorEl} = this.state
    const open = Boolean(anchorEl)

    const txArr = Object.keys(txs).reverse()

    console.log('RENDER Transactions')
//onClick={this.handleMenu}
    return (
      <div className="Transactions">
        <IconButton onClick={this.handleMenu} buttonRef={el => this.buttonRef = el} >
          <TrackChangesIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: 250,
              width: 300,
            },
          }}
        >
          {txArr.length ? txArr.map(txHash => (
            <Transaction key={txHash} txHash={txHash} />
          )) : <ListItem><ListItemText>No transactions</ListItemText></ListItem>}

        </Menu>
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    txs: state.transactions,
    open: state.txsMenu.opened
  }
}, (dispatch, ownProps) => {
  return {
    openMenu: () => {
      dispatch(openTxsMenu())
    },
    closeMenu: () => {
      dispatch(closeTxsMenu())
    },
    onTxScan: (txs) => {
      getScannedTx({txs}).forEach(txHash => dispatch(getTxStatus(txHash, () => {
        const name = getTxName(txs[txHash], txHash)

        alert(`Transaction ${name} was successful.`)

        dispatch(getAccount())
      }, () => {
        const name = getTxName(txs[txHash], txHash)

        alert(`Transaction ${name} failed.`)
      })))
    }
  }
})(Transactions)
