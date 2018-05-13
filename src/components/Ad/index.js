import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import dotProp from 'dot-prop-immutable-chain'

import './index.css'

import AdCard from './AdCard'
import AdDetails from './AdDetails'

import {getAd, getAdDetails, showAd, zoomAd, unzoomAd, showAdForm, initDraft, newColumn, addFav, removeFav, upAd, addToBL, removeFromBL} from '../../store/actions'
import {getCatsByName, getFavsById, getBlacklistById} from '../../store/selectors'

class Ad extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    view: PropTypes.oneOf(['card', 'details']).isRequired,
  }

  async componentWillMount() {
    const {ad, loadAd} = this.props

    if (ad) return

    await loadAd()
  }

  onRemoveFromBL = () => {
    const {onRemoveFromBL, ad, loadAd} = this.props

    onRemoveFromBL()

    const loaded = dotProp(ad).get('eth.loaded').value()

    if (!loaded) loadAd()
  }

  render() {
    const {id,
      ad,
      view,
      cats,
      onShowAdDetails,
      onZoom,
      onUnzoom,
      loadAd,
      onEdit,
      onShowUser,
      onAddFav,
      onRemoveFav,
      isFav,
      onUp,
      account,
      onAddToBL,
      isBlacklisted
    } = this.props

    const {onRemoveFromBL} = this

    const catId = dotProp(ad).get('eth.data.catId').value()

    const commonProps = {
      onReload: loadAd,
      onEdit,
      catName: (catId && cats[catId] ? cats[catId].name : ''),
      onAddFav,
      onRemoveFav,
      isFav,
      onUp,
      account,
      onAddToBL,
      onRemoveFromBL,
      isBlacklisted
    }

    return (ad
      ?
        (view === 'card'
        ?
          <AdCard
            ad={ad}
            onShowAdDetails={onShowAdDetails}
            onShowUser={onShowUser}
            {...commonProps}
          />
        :
          <AdDetails
            ad={ad}
            onZoom={onZoom}
            onUnzoom={onUnzoom}
            {...commonProps}
          />
        )
      :
        <div style={{height: '400px'}}></div>
    )
  }
}

export default connect((state, ownProps) => {
    return {
      ad: state.ads.byId[ownProps.id],
      cats: state.cats.byId,
      isFav: getFavsById(state)[ownProps.id],
      account: state.account,
      isBlacklisted: getBlacklistById(state)[ownProps.id],
    }
  }, (dispatch, ownProps) => {
    const id = ownProps.id

    return {
      loadAd: async () => {
        await dispatch(getAd(id))
        dispatch(getAdDetails(id))
      },
      onShowAdDetails: () => {
        dispatch(showAd(id))
      },
      onEdit: (ad) => {
        const draftId = `${ad.id}_${ad.eth.data.updatedAt}`

        /* need clean drafts */

        dispatch(initDraft(draftId, {
          id: ad.id,
          catId: ad.eth.data.catId,
          header: ad.bzz.data.header,
          text: ad.bzz.data.text,
          photos: ad.bzz.data.photos
        }))

        dispatch(showAdForm(draftId))
      },
      onZoom: () => {
        dispatch(zoomAd())
      },
      onUnzoom: () => {
        dispatch(unzoomAd())
      },
      onShowUser: (param) => {
        dispatch(newColumn('user', param))
      },
      onAddFav: () => {
        dispatch(addFav(id))
      },
      onRemoveFav: () => {
        dispatch(removeFav(id))
      },
      onUp: () => {
        dispatch(upAd(id))
      },
      onAddToBL: () => {
        dispatch(addToBL(id))
      },
      onRemoveFromBL: () => {
        dispatch(removeFromBL(id))
      }
    }
  }
)(Ad)
