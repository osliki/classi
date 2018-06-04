import React, {Component} from 'react'
import {connect} from 'react-redux'
import {onChangeAccount, web3, contractToken} from '../../provider'
import {getUserShort} from '../../utils'

import './index.css'

import Bar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import Avatar from '@material-ui/core/Avatar'

import Transactions from '../Transactions'

import {getAccount} from '../../store/actions'

class AppBar extends Component {

  constructor(props) {
    super(props)

    web3 && onChangeAccount(this.props.getAccount)
  }

  precisionRound(number, precision) {
    const factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  render() {
    const {address, tokenBalance, tokenAllowance, upPrice} = this.props.account

    console.log('RENDER AppBar', this.props.account)

    return (
      <Bar position="sticky" color="default">
        <Toolbar classes={{root: 'toolbar'}}>
          <Avatar component="span" alt=""  src="./favicon.ico" />
          <Typography noWrap variant="title" style={{flex: 1, paddingLeft: '10px'}}>
             Osliki Classifieds
          </Typography>

          <Typography component="div">
            <Transactions />
          </Typography>

          <Typography component="div">
            <Typography variant="subheading">
              <span title={address ? address : 'Guest'}>{address ? getUserShort(address) : 'Guest'}</span>
            </Typography>

            {address
              ?
                <Typography color="textSecondary" variant="body1">
                  <span title={`Inner currency OSLIK ${contractToken._address}`}>
                    {this.precisionRound(web3.utils.fromWei(String(tokenBalance), 'ether'), 2)} OSLIK
                  </span>

                  {tokenAllowance > upPrice
                    ?
                      <span title="This dApp is authorized" >
                        <LockOpenIcon style={{fontSize: 14}} />
                      </span>
                    :
                      <span title="This dApp not authorized" >
                        <LockIcon style={{fontSize: 14}} />
                      </span>
                  }
                </Typography>
              :
                null
            }
          </Typography>


        </Toolbar>
      </Bar>
    )
  }
}


export default connect((state, ownProps) => {
  return {
    account: state.account
  }
}, (dispatch, ownProps) => {
  return {
    getAccount: () => {
      dispatch(getAccount())
    }
  }
})(AppBar)
