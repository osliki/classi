import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import moment from 'moment'
import {TextLoader} from '../Loaders'
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

    console.log('RENDER Comment', comment)
    return (
      <div className="Comment">
        {dateFrom}
        <br/>
        user: {isAuthor ? 'me' : <UserName user={user} />}
        <br/>

        {loaded ?
          text
        :
          <div>
            <TextLoader animate={!errorEth && !errorBzz} />

            {errorBzz ?
              <div className="retry-link">
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
    onReload: () => {
      dispatch(getComment(ownProps.id))
    }
  }
})(Comment)
