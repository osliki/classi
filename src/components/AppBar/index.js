import React, {Component} from 'react'
import {connect} from 'react-redux'
import {onChangeAccount, web3} from '../../provider'
import {getUserShort} from '../../utils'

import './index.css'

import Bar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import Menu, { MenuItem } from 'material-ui/Menu'
import Avatar from 'material-ui/Avatar'
import Tooltip from 'material-ui/Tooltip'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Snackbar from 'material-ui/Snackbar'

import UserName from '../UserName'
import Transactions from '../Transactions'

import {getAccount} from '../../store/actions'

class AppBar extends Component {

  componentWillMount() {
    //this.props.getAccount()

    onChangeAccount(this.props.getAccount)
  }

  render() {
    const {address, tokenBalance, tokenAllowance, upPrice} = this.props.account

    console.log('RENDER AppBar', this.props.account)

    return (
      <Bar position="sticky" color="default">
        <Toolbar classes={{root: 'toolbar'}}>
          <Avatar component="span" alt=""  src="/favicon.ico" />
          <Typography noWrap variant="title" style={{flex: 1, paddingLeft: '10px'}}>
             Osliki Classifieds
          </Typography>

          <Typography component="div">
            <Typography variant="subheading">
              <span title={address ? address : 'Guest'}>{address ? getUserShort(address) : 'Guest'}</span>
            </Typography>

            {address
              ?
                <Typography color="textSecondary" variant="body1">
                  <span title="Inner currency OSLIK">
                    {web3.utils.fromWei(String(tokenBalance), 'ether')} OSLIK
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

          <Typography component="div">
            <Transactions />
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
