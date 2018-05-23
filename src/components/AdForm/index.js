import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import './index.css'

import {
  FormLabel, FormControl, FormHelperText, FormControlLabel
} from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
import ButtonBase from 'material-ui/ButtonBase'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import {LinearProgress} from 'material-ui/Progress'
import IconButton from 'material-ui/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

import Img from '../Img'
import {SmallImgLoader} from '../Loaders'
import CatsAutocomplete from './CatsAutocomplete'

import {adFormChange, adFormPhotoUpload, adFormPhotoRemove, adFormSubmit, checkNewCats, openTouDialog} from '../../store/actions'
import {getCatsArray, getCatsByName} from '../../store/selectors'

class AdForm extends Component {
  static propTypes = {
    formRef: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.props.checkNewCats()
  }

  componentDidMount() {
    this.catNameInput && this.catNameInput.focus()
  }

  onChange = (e) => {
    this.props.onChange(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value)
  }

  onSubmit = (e) => {
    e.preventDefault()

    const {header, text, catName, catId, agree} = this.props.draft

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

    if (!agree) {
      this.agreeInput.parentNode.focus()
      return
    }

    this.props.onSubmit()

    return false
  }

  render() {
    const {formRef = () => {}, onChange, onUpload, onPhotoRemove, draft = {}, cats, catsByName, catsLoading, openTouDialog} = this.props
    const {id = '', catId = '', catName = '', header = '', text = '', agree = false, uploadingImgs = 0, photos = []} = draft
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
                items={getCatsArray({cats})}
                defaultSelectedItem={catsByName[catName]}
                helperText="Choose existed or enter a new category name"
                inputRef={el => this.catNameInput = el}
                catsLoading={catsLoading}
                onInputChange={(e, clearSelection, selectItem) => {
                  const val = e.target.value
                  const cat = catsByName[val.trim()]

                  onChange('catName', val)
                  onChange('catId', (cat ? cat.id : ''))

                  if (!cat) {
                    clearSelection()
                  } else {
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
<br/>
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
<br/>
          <FormControl margin='normal'>
            <FormLabel>Images:</FormLabel>
          </FormControl>

          <div className="img-list">

            {photos.map((hash, index) => (
              <div className="img-item" key={hash}>
                <Img
                  hash={hash}
                  src={`https://gateway.ipfs.io/ipfs/${hash}`}
                  loader={<SmallImgLoader />}
                 />

                <div className="img-remove">
                  <IconButton size="small" onClick={() => {
                    onPhotoRemove(index)
                  }}>
                    <ClearIcon />
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

          <FormHelperText className="photos-helper">
            Your photos will be spreaded among other users directly from your computer. To make sure they are cached on other computers, visit this website as often as possible. It is also not recommended to upload too large pictures.
          </FormHelperText>
<br/>
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                required
                name="agree"
                onChange={this.onChange}
                color="primary"
                inputRef={el => this.agreeInput = el}
              />
            }
            label={
              <span>
                * I agree with <a href="#" onClick={openTouDialog}>Terms of Use</a>
              </span>
            }
          />

          <button type="submit" style={{display: 'none'}} />
        </form>
      </section>
    )
  }
}


export default connect((state, ownProps) => {
  return {
    cats: state.cats,
    catsLoading: state.cats.loading,
    catsByName: getCatsByName(state),
    draft: state.drafts[ownProps.draftId]
  }
}, (dispatch, ownProps) => {
  const {draftId} = ownProps

  return {
    onChange: (name, value) => dispatch(adFormChange(draftId, name, value)),
    onUpload: (e) => {
      e.preventDefault()

      dispatch(adFormPhotoUpload(draftId, e.target.files))
    },
    onPhotoRemove: (index) => dispatch(adFormPhotoRemove(draftId, index)),
    onSubmit: () => dispatch(adFormSubmit(draftId)),
    checkNewCats: () => dispatch(checkNewCats()),
    openTouDialog: () => dispatch(openTouDialog())
  }
})(AdForm)


//                   src={`http://swarm-gateways.net/bzzr:/${hash}`}
