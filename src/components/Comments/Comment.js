import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import './index.css'

import Typography from 'material-ui/Typography'

import moment from 'moment'
import {CommentLoader} from '../Loaders'
import UserName from '../UserName'

import {getComment} from '../../store/actions'

class Comment extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    if (!this.props.ad) this.props.getComment()
  }

  render() {
    const {comment = {}, onReload, account} = this.props
    const {eth = {}, bzz = {}} = comment
    const {data: dataEth = {}, error: errorEth} = eth
    const {data: dataBzz = {}, error: errorBzz, loaded = false} = bzz

    const {user = '', createdAt = ''} = dataEth
    const {text = ''} = dataBzz

    const dateFrom = createdAt ? moment(createdAt * 1000).fromNow() : '...'
    const dateUsual = createdAt ? moment(createdAt * 1000).calendar() : '...'

    const isAuthor = (account.address && account.address === user)

    console.log('RENDER Comment', comment, errorBzz)

    return (
      <div className="Comment">

        <Typography noWrap component="div" color="textSecondary">
          <span title={dateUsual}>
            {`${dateFrom}`}
          </span>
          &nbsp;|&nbsp;
          <span title={user}>
            {isAuthor ? 'me' : <UserName user={user} />}
          </span>
        </Typography>

        {loaded ?
          <Typography component="pre">
            {text}
          </Typography>
        :
          <div>
            <CommentLoader animate={!errorEth && !errorBzz} />

            {errorBzz ?
              <div className="retry-link retry-link-comment">
                <a href="#" onClick={onReload}>Reload</a>
              </div>
            :
              null
            }
          </div>
        }
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    comment: state.comments.byId[ownProps.id],
    account: state.account
  }
}, (dispatch, ownProps) => {
  return {
    getComment: () => {
      dispatch(getComment(ownProps.id))
    },
    onReload: (e) => {
      e.preventDefault()
      dispatch(getComment(ownProps.id))
    }
  }
})(Comment)
