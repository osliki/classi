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

  async componentWillMount() {
console.log('Ad componentWillMount')
    const {id, ad, dispatch} = this.props

    if (ad) return

    await dispatch(getAd(id))
    dispatch(getAdDetails(id))
  }

  render() {
    const {id, ad, view} = this.props

    return (
      <div>
        {ad ?
          (view === 'card' ? <AdCard ad={ad} /> : <AdDetails ad={ad} />) :
          null
        }
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    ad: state.ads.byId[ownProps.id]
  }
})(Ad)
