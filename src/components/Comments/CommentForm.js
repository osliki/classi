import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {addNewComment, initDraft, adFormChange, commentSubmit} from '../../store/actions'

class CommentFrom extends Component {

  static propTypes = {
    adId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.props.initDraft()
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.props.onSubmit()
  }

  onChange = (e) => {
    this.props.onChange(e.target.name, e.target.value)
  }

  render() {
    const {onSubmit, onChange} = this
    const {adId, draft = {}} = this.props
    const {text, loading} = draft

    console.log('RENDER CommentForm', draft)

    return (
      <form onSubmit={onSubmit}>
        <input type="text" name="text" value={text} onChange={onChange} />
        <button disabled={Boolean(loading)}>Send</button>
      </form>
    )
  }
}

const draftId = 'comment'

export default connect((state, ownProps) => {
  return {
    draft: state.drafts[draftId]
  }
}, (dispatch, ownProps) => {
  return {
    initDraft: () => dispatch(initDraft(draftId)),
    onChange: (name, value) => dispatch(adFormChange(draftId, name, value)),
    onSubmit: () => {
      dispatch(commentSubmit(ownProps.adId))
    }
  }
})(CommentFrom)
