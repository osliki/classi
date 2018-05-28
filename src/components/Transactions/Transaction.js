import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import './index.css'

import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';

import {getTxName} from '../../utils'
import {removeTx} from '../../store/actions'

class Transactions extends Component {
  static propTypes = {
    txHash: PropTypes.string.isRequired
  }

  render() {
    const {tx, txHash, onRemoveTx} = this.props
    const {status = '...'} = tx

    let name = getTxName(tx, txHash, true)

    console.log('RENDER Transaction', tx)

    return (
      <ListItem>
        <ListItemText
          primary={
            <Typography noWrap>{name}</Typography>
          }
          secondary={
            <span>
              status:&nbsp;

              <span title={status === 'succeed' ? `more than 5 confirmations` : ''}>
                <b>{status}</b>&nbsp;
              </span>

              <a title="check on Etherscan" href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
              >
                <OpenInNewIcon style={{fontSize: '12px'}} />
              </a>
            </span>
          }
        />

        <ListItemSecondaryAction>
          <IconButton title={'Remove transaction'}>
            <ClearIcon onClick={onRemoveTx} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

}


/*
<ListItemText primary="Photos" secondary="Jan 9, 2014" />
        <ListItemSecondaryAction>
          <IconButton aria-label="Comments">
            <ClearIcon />
          </IconButton>
        </ListItemSecondaryAction>
        */

export default connect((state, ownProps) => {
  return {
    tx: state.transactions[ownProps.txHash]
  }
}, (dispatch, ownProps) => {
  const txHash = ownProps.txHash

  return {
    onRemoveTx: () => {
      dispatch(removeTx(txHash))
    }
  }
})(Transactions)
