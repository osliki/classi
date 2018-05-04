import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {contract, web3, account} from '../../provider'

import './index.css'

import Img from '../Img'
import {SmallImgLoader} from '../Loaders'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button';
import ButtonBase from 'material-ui/ButtonBase';
import FileUpload from '@material-ui/icons/FileUpload';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

class AdForm extends Component {
  static propTypes = {
    catId: PropTypes.number,
  }

  constructor(props) {
    super(props)

    this.state = {
      catId: props.catId,
      catName: '',
      header: '',
      text: '',
      photos: [/*
        "83e98c64136dd783b783de62636c05b0a166f222218b7c1bfabf386e0f9da384",
        "fc70151dd834403a7c5d5ef2c53b62ea824344de19f8d2fa96b1cddc5799df46",
        "fdea35dc83be2483e7e6715bd0e25080e172097c61730c414dd4b88152965a10",
        "83e98c64136dd783b783de62636c05b0a166f222218b7c1bfabf386e0f9da384",
        "c002c1376964309a9647d4830bdeae0b84d42b7f5651675e37493f56cf5b7e28",
      */],
      loadedImgs: 0,
      totalImgs: 0,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.removePhoto = this.removePhoto.bind(this)
  }


  removePhoto(index) {
    this.setState(prevState => {
      return {
        totalImgs: prevState.totalImgs - 1,
        photos: [...prevState.photos.slice(0, index), ...prevState.photos.slice(index + 1)],
      }
    })
  }

  handleUpload(e) {
    console.log('handleUpload')
    e.preventDefault()

    const files = e.target.files

    this.setState(prevState => {
      return {
        totalImgs: prevState.totalImgs + files.length
      }
    })

    console.dir(files)

    Array.from(files).forEach(file => {
      const reader = new FileReader()

      reader.onload = e => {
        console.log('onload')
        const data = new Uint8Array(e.target.result)
        console.log(data)

        web3.bzz.upload(data).then(hash => {
          console.log(hash)
          this.setState(prevState => {
            console.dir(prevState)
            return {
              loadedImgs: prevState.loadedImgs + 1,
              photos: [...prevState.photos, hash],
            }
          })
        }).catch(err => {
          alert(`Error while uploading img ${file.name}`)

          this.setState(prevState => {
            return {
              totalImgs: prevState.totalImgs - 1
            }
          })
        })
      }

      reader.readAsArrayBuffer(file);
    })



  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    console.log('handleSubmit')
    e.preventDefault()

    const { catName, catId, header, text, photos } = this.state

/*
    web3.bzz.download('72f5d7a6c952eaa2c8426b3b87eca35509d00561ea96c202fc3d8fd1f380ea05').then(res => {
    //web3.bzz.download('d3bebb2c0f9f338d2109965d39a1fb7094e9725083a68da1271c6f64396c36a4').then(res => {
      console.dir(res)
      if (res) {

        console.dir(new TextDecoder("utf-8").decode(res))
        console.log(JSON.parse(new TextDecoder("utf-8").decode(res)))
      }
    })

    return;*/




    const data = {
      header: header,
      text: text,
      photos: photos,
    }

    web3.bzz.upload(JSON.stringify(data)).then(hash => {
      console.log("Uploaded file. Address:", hash)

      contract.methods.newCatWithAd(catName, hash).send({
        from: account,
        gasPrice: web3.utils.toWei('1', 'gwei'),
        gas: 300000,
        value: 0,
      }).on('receipt', receipt => {
          console.log('receipt')
          console.dir(receipt)
        }).on('confirmation', function(confirmationNumber, receipt){
          if (confirmationNumber === 5)
            console.dir(receipt)
        }).on('error', (err, receit) => {
          console.log('err = ', err)
          console.log('error receit')
          console.dir(receit)
        })


      web3.bzz.download(hash).then(arr => {
        console.dir(arr)

        //if (arr) {
        try {
          console.dir(web3.bzz.toString(arr))
          console.log(JSON.parse(web3.bzz.toString(arr)))
        } catch(err) {}
        //}
        /*
        if (res && res.ad && res.ad.data) {
          console.dir(new TextDecoder("utf-8").decode(res.ad.data))
          console.log(JSON.parse(new TextDecoder("utf-8").decode(res.ad.data)))
        }*/
      })
    })

return

  }






  render() {
    //let {category, user} = this.props

    //console.dir(this.context.contract)
    const { loadedImgs, totalImgs } = this.state

    return (
      <section className="AdForm">
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
          <input name="id" value="{this.state.id}" type="hidden"/>
          <input name="catId" value="{this.state.catId}" type="hidden"/>




          <TextField
            name="catName"
            label="Category"
            value={this.state.catName}
            onChange={this.handleChange}
            margin="normal"
            fullWidth
          />

          <TextField
            name="header"
            label="Header"
            value={this.state.header}
            onChange={this.handleChange}
            margin="normal"
            fullWidth
          />

          <TextField
            name="text"
            label="Text"
            value={this.state.text}
            onChange={this.handleChange}
            margin="normal"
            multiline
            fullWidth
          />





          <h3>Images </h3>

          <div className="img-list">

            {this.state.photos.map((hash, index) => (
              <div className="img-loaded" key={index}>
                <Img
                   src={`http://swarm-gateways.net/bzzr:/${hash}`}
                   loader={<SmallImgLoader />}
                 />

                <div className="img-remove">
                  <IconButton size="small">
                    <ClearIcon onClick={() => {
                      this.removePhoto(index)
                    }}/>
                  </IconButton>
                </div>

              </div>
            ))}

            <div className="upload">
              <label>
                <ButtonBase focusRipple component="span" title="Upload">
                  <PhotoCamera />
                </ButtonBase>

                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleUpload}
                  multiple
                  style={{display: 'none'}}
                />
              </label>

              <div className="upload-progress" style={{
                display: (loadedImgs === totalImgs ? 'none' : 'block')
              }}>
                {`${loadedImgs}/${totalImgs}`}

                <LinearProgress style={{
                  marginTop: '-2px',
                }} />
              </div>
            </div>

          </div>



          <Button type="submit">Submit</Button>

        </form>
      </section>
    )
  }
}

export default connect((state, ownProps) => {
  return {

  }
})(AdForm)
