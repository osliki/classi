import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {CircularProgress} from 'material-ui/Progress'
import Typography from 'material-ui/Typography'

import Comment from './Comment'
import CommentForm from './CommentForm'

import {getComments, checkComments} from '../../store/actions'

class Comments extends Component {

  static propTypes = {
    adId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.props.getComments()

    this.interval = setInterval(this.props.checkComments, 5000);
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }

  render() {
    const {comments, loading, error, adId} = this.props

    return (
      <section className="Comments">
        {loading ?
          <div className="circ-progress">
            <CircularProgress size={30} />
          </div>
        :
          (error ?
            error.message
          :
            <div>
              {comments.length ?
                comments.map(id => <Comment key={id} id={id} />)
              :
                <Typography align="center" style={{flex: 1}}>
                  <br/><br/>
                  No comments
                </Typography>
              }

              <CommentForm adId={adId} />

            </div>
          )
        }
      </section>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    loading: state.comments.loading,
    error: state.comments.error,
    comments: state.comments.allIds
  }
}, (dispatch, ownProps) => {
  return {
    getComments: () => dispatch(getComments(ownProps.adId)),
    checkComments: () => dispatch(checkComments(ownProps.adId))
  }
})(Comments)
