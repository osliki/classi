import React, { Component } from 'react'
import './index.css'
import PropTypes from 'prop-types'

class Column extends Component {
  static propTypes = {
    category: PropTypes.number,
    user: PropTypes.string
  }

  static contextTypes = {
    web3: PropTypes.object,
    contract: PropTypes.object,
    account: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      ads: []
    }
  }

  async componentWillMount() {
    const { web3, contract, account } = this.context

console.dir(this.props)
    const adsCount = await contract.methods.getAdsCount().call()
console.log('adsCount', adsCount)
    let promises = []

    let minId = adsCount - 1 - 3
    if (minId < 0)
      minId = 0;

    for (let id = adsCount - 1; id >= minId; id--) {
      promises.push(contract.methods.ads(id).call())
    }

    const ads = await Promise.all(promises)
console.dir(ads)
    this.setState(prevState => {
      return {
        ads: [...ads, ...prevState.ads]
      }
    })
  }

  render() {
    let {category, user} = this.props

    //console.dir(this.context.contract)

    return (
      <section className="Column">
        {this.state.ads.map(ad => (
          <div key={ad.id}>
            {ad.id}<br />
            {ad.user}<br />
            {ad.catId}<br />
            {ad.text}<br />
            {ad.createdAt}<br />
            {ad.updateAt}<br />
          </div>
        ))}
      </section>
    )
  }
}

export default Column
