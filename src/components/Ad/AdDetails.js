import React, { Component } from 'react'
import './index.css'
import PropTypes from 'prop-types'
import moment from 'moment'
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
class AdDetails extends Component {
  static propTypes = {
    adId: PropTypes.number.isRequired,
    ad: PropTypes.object,
    adDetails: PropTypes.object,
  }

  constructor(props) {
    super(props)

    const { ad, adDetails, } = props

    this.state = {
      ad: ad || {},
      adDetails: adDetails || {},
      adLoaded: !!ad,
      adDetailsLoaded: !!adDetails,
      needTryAgain: false,
    }
  }

  async componentWillMount() {
    const { adId, contract, web3, } = this.props
    const { adLoaded, adDetailsLoaded, } = this.state

    let ad, adDetails
console.log(adId)
    if (adLoaded) {
      ad = this.props.ad
    } else {
      try {
        ad = await contract.methods.ads(adId).call()
      } catch(err) {}
      if (!ad) return

      this.setState({
        ad: ad,
        adLoaded: true,
      })
    }

    if (adDetailsLoaded) {
      return
    }

    this.getDetails()

  }

  async getDetails() {
    const { web3 } = this.props
    const { ad } = this.state

    let adDetails, adDetailsRaw

    try {
      adDetailsRaw = await web3.bzz.download(ad.text)
    } catch(err) {
      this.setState({
        needTryAgain: true,
      })
    }
    if (!adDetailsRaw) return

    try {
      adDetails = JSON.parse(new TextDecoder("utf-8").decode(adDetailsRaw))
    } catch(err) {}
    if (!adDetails) return

    this.setState({
      adDetails: adDetails,
      adDetailsLoaded: true,
    })
  }

  render() {
    //const { cats, ad, account } = this.props
    const {
      ad,
      adDetails,
      adLoaded,
      adDetailsLoaded,
    } = this.state

    //const createdAt = moment(ad.createdAt * 1000).fromNow()
    //const updatedAt = moment(ad.updatedAt * 1000).fromNow()

    return (
      <div className="AdDetails">
        { !adLoaded && !adDetailsLoaded
          ?
            <CircularProgress />
          :
            <div>
              <Typography gutterBottom variant="headline" component="h2">
                {adDetails.header}
              </Typography>
            </div>
        }
      </div>
    )
  }
}

export default AdDetails
