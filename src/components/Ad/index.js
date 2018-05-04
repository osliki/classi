import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import './index.css'
import AdCard from './AdCard'
import AdDetails from './AdDetails'

import {getAd, getAdDetails} from '../../store/actions'

class Ad extends Component {

  static propTypes = {
    id: PropTypes.number.isRequired,
    view: PropTypes.oneOf(['card', 'details']).isRequired,
  }

  constructor(props) {
    super(props)

    this.onReload = this.onReload.bind(this)
  }

  componentWillMount() {
    const {ad} = this.props

    if (ad) return

    this.load()
  }

  load = async () => {
    const {id, dispatch} = this.props

    await dispatch(getAd(id))
    dispatch(getAdDetails(id))
  }

  onReload = (e) => {
    e.preventDefault()

    this.load()
  }

  render() {
    const {id, ad, view} = this.props

    return (ad
      ?
        (view === 'card' ? <AdCard ad={ad} onReload={this.onReload} /> : <AdDetails ad={ad} />)
      :
        null
    )
  }
}

export default connect((state, ownProps) => {
  return {
    ad: state.ads.byId[ownProps.id]
  }
})(Ad)
