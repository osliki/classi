import React, {Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import './index.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {CircularProgress} from 'material-ui/Progress'
import Ad from '../Ad'

import {getColumnAds} from '../../store/actions'

class Column extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    column: PropTypes.object.isRequired,
  }

  async componentWillMount() {
    const {id, dispatch} = this.props

    var res = await dispatch(getColumnAds(id))
  }

  render() {
    let {ads, loading} = this.props.column

    return (
      <section className="Column">
        {loading
          ?
            <CircularProgress />
          :
            <PerfectScrollbar option={{suppressScrollX: true}}>
              {ads.map(id => (
                <Ad key={id} id={id} view="card" />
              ))}
            </PerfectScrollbar>
        }
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
