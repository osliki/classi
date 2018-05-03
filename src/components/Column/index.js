import React, {Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import './index.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import Ad from '../Ad'

import {getColumnAds} from '../../store/actions'

class Column extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    column: PropTypes.object.isRequired,
  }

  async componentWillMount() {
console.log('COLUMNcomponentWillMount', this.props)
    const {id, dispatch} = this.props

    var res = await dispatch(getColumnAds(id))
  }

  render() {
console.log('COLUMNrender', this.props)
    let {ads} = this.props.column
    return (
      <section className="Column">
        <PerfectScrollbar option={{suppressScrollX: true}}>
          {ads.map(id => (
            <Ad key={id} id={id} view="card" />
          ))}
        </PerfectScrollbar>
      </section>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    column: state.columns.byId[ownProps.id]
  }
})(Column)



/*
  const adsCount = await contract.methods.getAdsCount().call()

  let promises = []

  let minId = adsCount - 1 - 3
  if (minId < 0)
    minId = 0

  for (let id = adsCount - 1; id >= minId; id--) {
    promises.push(contract.methods.ads(id).call())
  }

  const ads = await Promise.all(promises)

  this.setState(prevState => {
    return {
      ads: [...ads, ...prevState.ads]
    }
  })*/
