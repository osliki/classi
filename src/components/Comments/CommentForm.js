import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import {initDraft, adFormChange, commentSubmit} from '../../store/actions'

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

    const {onSubmit, draft} = this.props

    if (draft.text.trim() === '') {
      this.textInput.focus()
      return
    }

    onSubmit()
  }

  onChange = (e) => {
    this.props.onChange(e.target.name, e.target.value)
  }

  render() {
    const {onSubmit} = this
    const {draft = {}} = this.props
    const {text, loading} = draft

    console.log('RENDER CommentForm', draft)

    return (
      <div className="CommentForm">
        <form onSubmit={onSubmit}>
          <TextField
            name="text"
            placeholder="Add a new comment..."
            value={text}
            onChange={this.onChange}
            margin="normal"
            multiline
            fullWidth
            inputRef={el => this.textInput = el}
            required
          />

          <Button onClick={onSubmit} disabled={Boolean(loading)}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>

        </form>
      </div>
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
