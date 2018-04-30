import React, { Component } from 'react'
import './index.css'
import PropTypes from 'prop-types'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { connect } from '../../store'

class Column extends Component {
  static propTypes = {
    category: PropTypes.number,
    user: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      ads: []
    }
  }

  async componentWillMount() {
    const { contract, account } = this.props

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
    })
  }

  render() {
    let {category, user} = this.props

    return (
      <section className="Column">
        <PerfectScrollbar option={{suppressScrollX: true}}>
          {this.state.ads.map((ad, id) => (
            <div key={id}>
              {ad.id}<br />
              {ad.user}<br />
              {ad.catId}<br />
              {ad.text}<br />
              {ad.createdAt}<br />
              {ad.updateAt}<br />
            </div>
          ))}
        </PerfectScrollbar>
      </section>
    )
  }
}

export default connect(state => ({
  contract: state.contract,
  account: state.account,
}))(Column)
