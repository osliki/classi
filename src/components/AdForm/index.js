import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import dotProp from 'dot-prop-immutable-chain'
import {contract, web3, account} from '../../provider'

import './index.css'

import {
  FormLabel, FormControl, FormControlLabel, FormHelperText
} from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button';
import ButtonBase from 'material-ui/ButtonBase';
import FileUpload from '@material-ui/icons/FileUpload';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import Img from '../Img'
import {SmallImgLoader} from '../Loaders'

import {adFormChange, adFormPhotoUpload, adFormPhotoRemove, adFormSubmit, initDraft} from '../../store/actions'

class AdForm extends Component {
  static propTypes = {
    ad: PropTypes.object,
    formRef: PropTypes.func
  }
/*
  constructor(props) {
    super(props)

    if (!props.draft)
      props.initDraft()
  }*/

  onSubmit = (e) => {
    e.preventDefault()

    const {header, text, catName, catId} = this.props.draft

    if (header === '') {
      this.headerInput.focus()
      return
    }

    if (text === '') {
      this.textInput.focus()
      return
    }

    if (catName === '' && catId === '') {
      this.catNameInput.focus()
      return
    }

    this.props.onSubmit()
  }

  render() {
    const {formRef = () => {}, onChange, onUpload, onPhotoRemove, draft = {}} = this.props
    const {id = '', catId = '', catName = '', header = '', text = '', uploadingImgs = 0, photos = []} = draft
    const totalImgs = photos.length + uploadingImgs

    return (
      <section className="AdForm">
        <form ref={el => formRef(el)} onSubmit={this.onSubmit} noValidate autoComplete="off">
          <input name="id" value={id} type="hidden"/>
          <input name="catId" value={catId} type="hidden"/>

          <TextField
            name="catName"
            label="Category"
            value={catName}
            onChange={onChange}
            margin="normal"
            fullWidth
            inputRef={el => this.catNameInput = el}
            required
          />

          <TextField
            name="header"
            label="Header"
            value={header}
            onChange={onChange}
            margin="normal"
            fullWidth
            inputRef={el => this.headerInput = el}
            required
          />

          <TextField
            name="text"
            label="Text"
            value={text}
            onChange={onChange}
            margin="normal"
            multiline
            fullWidth
            rows={5}
            inputRef={el => this.textInput = el}
            required
          />

          <FormControl margin='normal'>
            <FormLabel>Images:</FormLabel>
          </FormControl>

          <div className="img-list">

            {photos.map((hash, index) => (
              <div className="img-item" key={index}>
                <Img
                   src={`http://swarm-gateways.net/bzzr:/${hash}`}
                   loader={<SmallImgLoader />}
                 />

                <div className="img-remove">
                  <IconButton size="small">
                    <ClearIcon onClick={() => {
                      onPhotoRemove(index)
                    }}/>
                  </IconButton>
                </div>

              </div>
            ))}

            <div className="img-item upload">
              <label>
                <ButtonBase focusRipple component="span" title="Upload">
                  <PhotoCamera />
                </ButtonBase>

                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  multiple
                  style={{display: 'none'}}
                />
              </label>

              <div className="upload-progress" style={{
                display: (photos.length === totalImgs ? 'none' : 'block')
              }}>
                {`${photos.length}/${totalImgs}`}

                <LinearProgress style={{
                  marginTop: '-2px',
                }} />
              </div>
            </div>

          </div>
          <button type="submit" style={{display: 'none'}} />
        </form>
      </section>
    )
  }
}

/*
const getDraftId = (props) => {
  return props.ad ? `${props.ad.id}_${props.ad.updatedAt}` : 'new'
}
*/

export default connect((state, ownProps) => {
  return {
    draft: state.drafts[ownProps.draftId]
  }
}, (dispatch, ownProps) => {
  const {draftId, ad} = ownProps

  return {
    initDraft: () => {
      dispatch(initDraft(draftId, ad))
    },
    onChange: (e) => {
      dispatch(adFormChange(draftId, e.target.name, e.target.value))
    },
    onUpload: (e) => {
      e.preventDefault()

      dispatch(adFormPhotoUpload(draftId, e.target.files))
    },
    onPhotoRemove: (index) => {
      dispatch(adFormPhotoRemove(draftId, index))
    },
    onSubmit: () => {
      dispatch(adFormSubmit(draftId))
    }
  }
})(AdForm)
