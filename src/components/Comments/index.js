import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

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

    this.interval = setInterval(this.props.checkComments, 5000)

    this.state = {} // to avoid Warning: Comments: Did not properly initialize state during construction. Expected state to be an object, but it was undefined.
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.adId !== nextProps.comments.adId) nextProps.getComments()

    return null
  }

  render() {
    const {allIds: comments, loading, error} = this.props.comments

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

              <CommentForm adId={this.props.adId} />

            </div>
          )
        }
      </section>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    comments: state.comments
  }
}, (dispatch, ownProps) => {
  return {
    getComments: () => dispatch(getComments(ownProps.adId)),
    checkComments: () => dispatch(checkComments(ownProps.adId))
  }
})(Comments)
