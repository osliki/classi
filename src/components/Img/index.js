//https://github.com/mbrevda/react-image

import React, {Component} from 'react'
import {node, func, string, number} from 'prop-types'
import {getIpfs} from '../../provider'

class Img extends Component {
  static propTypes = {
    loader: node,
    loaded: func,
    unloader: node,
    retryDelay: number,
    retryCount: number,
    src: string.isRequired,
    hash: string
  }

  static defaultProps = {
    loader: null,
    loaded: null,
    unloader: null,
    retryDelay: 1,
    retryCount: 8
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      isLoaded: false,
      retryCounter: props.retryCount
    }

    this.loadImg()
  }

  componentWillUnmount() {
    this.unloadImg()
  }

  loadImg = async () => {
    if (this.props.hash) {
      try {
        const ipfs = await getIpfs()
        const file = await ipfs.files.cat(this.props.hash)
        const blob = new Blob([file], {type: 'image/*'})
        this.objectUrl = window.URL.createObjectURL(blob)
      } catch (error) {
        console.log('IMG error', error)
        this.onError()
      }
    }

    this.i = new Image()
    this.i.src = this.objectUrl || this.props.src
    this.i.onload = this.onLoad
    this.i.onerror = this.onError
  }

  unloadImg = () => {
    if (this.i) {
      this.i.onerror = null
      this.i.onload = null
      this.i.src = null
      this.i = null
    }

    this.objectUrl && window.URL.revokeObjectURL(this.objectUrl)
  }

  onLoad = () => {
    this.setState({isLoading: false, isLoaded: true})
  }

  onError = () => {
    if (this.state.retryCounter > 0) {
      setTimeout(this.loadImg, this.props.retryDelay * 1000)

      this.setState(prevState => ({
        retryCounter: prevState.retryCounter - 1
      }))
    } else {
      this.setState({
        isLoading: false,
        isLoaded: false
      })
    }
  }

  render() {
    const {isLoaded, isLoading, retryCounter} = this.state
    const {src, loader, loaded, unloader, retryCount, retryDelay, alt, ...rest} = this.props // clean ...rest
    const imgSrc = this.objectUrl || src
    // if we have loaded, show img
    if (isLoaded)
      return loaded ? loaded(imgSrc) : <img src={imgSrc} alt={alt ? alt : ''} {...rest} />

    // if we are still trying to load, show img and a Loader if requested
    if (!isLoaded && isLoading)
      return loader ? loader : 'Loading...'

    // if we have given up on loading, show a place holder if requested, or nothing
    if (!isLoaded && !isLoading && retryCounter <= 0)
      return unloader ? unloader : "Image can't be loaded"

    return null
  }
}

export default Img
