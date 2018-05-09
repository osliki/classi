import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import dotProp from 'dot-prop-immutable-chain'
import {contract, web3, account} from '../../provider'

import './index.css'

import {
  FormLabel, FormControl, FormControlLabel, FormHelperText
} from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import ButtonBase from 'material-ui/ButtonBase'
import FileUpload from '@material-ui/icons/FileUpload'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import { LinearProgress } from 'material-ui/Progress'
import IconButton from 'material-ui/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

import Img from '../Img'
import {SmallImgLoader} from '../Loaders'
import CatsAutocomplete from './CatsAutocomplete'

import {adFormChange, adFormPhotoUpload, adFormPhotoRemove, adFormSubmit, initDraft} from '../../store/actions'
import {getCatsArray, getCatsByName} from '../../store/selectors'

class AdForm extends Component {
  static propTypes = {
    formRef: PropTypes.func
  }

  onChange = (e) => {
    this.props.onChange(e.target.name, e.target.value)
  }

  onSubmit = (e) => {
    e.preventDefault()

    const {header, text, catName, catId} = this.props.draft

    if (catId === '' && catName.trim() === '') {
      this.catNameInput.focus()
      return
    }

    if (header.trim() === '') {
      this.headerInput.focus()
      return
    }

    if (text.trim() === '') {
      this.textInput.focus()
      return
    }

    this.props.onSubmit()
  }

  render() {
    const {formRef = () => {}, onChange, onUpload, onPhotoRemove, draft = {}, catsArray, catsByName} = this.props
    const {id = '', catId = '', catName = '', header = '', text = '', uploadingImgs = 0, photos = []} = draft
    const totalImgs = photos.length + uploadingImgs

    return (
      <section className="AdForm">
        <form ref={el => formRef(el)} onSubmit={this.onSubmit} noValidate autoComplete="off">
          <input name="id" value={id} type="hidden"/>
          <input name="catId" value={catId} type="hidden"/>
          {id
            ?
              null
            :
              <CatsAutocomplete
                inputValue={catName}
                items={catsArray}
                defaultSelectedItem={catsByName[catName]}
                inputRef={(el) => this.catNameInput = el}
                onInputChange={(e, clearSelection, selectItem) => {
                  const val = e.target.value
                  const cat = catsByName[val.trim()]

                  onChange('catName', val.toLowerCase())
                  onChange('catId', (cat ? cat.id : ''))

                  if (!cat) {
                    clearSelection()
                  }

                  if(catsByName[val]) {
                    selectItem(cat)
                  }
                }}
                onChange={(selectedItem) => {
                  if(!selectedItem) return

                  onChange('catName', selectedItem.name)
                  onChange('catId', selectedItem.id)
                }}
              />
          }

          <TextField
            name="header"
            label="Header"
            value={header}
            onChange={this.onChange}
            margin="normal"
            fullWidth
            inputRef={el => this.headerInput = el}
            required
          />

          <TextField
            name="text"
            label="Text"
            value={text}
            onChange={this.onChange}
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


export default connect((state, ownProps) => {
  return {
    catsArray: getCatsArray(state),
    catsByName: getCatsByName(state),
    draft: state.drafts[ownProps.draftId]
  }
}, (dispatch, ownProps) => {
  const {draftId, ad} = ownProps

  return {
    initDraft: () => {
      dispatch(initDraft(draftId, ad))
    },
    onChange: (name, value) => {
      dispatch(adFormChange(draftId, name, value))
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
