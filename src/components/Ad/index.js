import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import dotProp from 'dot-prop-immutable-chain'

import './index.css'

import AdCard from './AdCard'
import AdDetails from './AdDetails'

import {getAd, getAdDetails, zoomAd, unzoomAd, showAdForm, initDraft, newColumn, addFav, removeFav, openUpAdDialog, addToBL, removeFromBL} from '../../store/actions'
import {getFavsById, getBlacklistById} from '../../store/selectors'
import {getDefaultAd} from '../../store/reducers'

class Ad extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    view: PropTypes.oneOf(['card', 'details']).isRequired,
  }

  constructor(props) {
    super(props)

    const {id} = this.props

    this.defaultAd = getDefaultAd(id)
  }

  onRemoveFromBL = () => {
    const {onRemoveFromBL, ad, loadAd} = this.props

    onRemoveFromBL()

    const loaded = dotProp(ad).get('eth.loaded').value()

    if (!loaded) loadAd()
  }

  render() {
    const {
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

    if (!ad) loadAd()

    return (view === 'card'
    ?
      <AdCard
        ad={ad || this.defaultAd}
        onShowAdDetails={onShowAdDetails}
        onShowUser={onShowUser}
        {...commonProps}
      />
    :
      <AdDetails
        ad={ad || this.defaultAd}
        onZoom={onZoom}
        onUnzoom={onUnzoom}
        {...commonProps}
      />
    )
  }
}

export default connect((state, ownProps) => {
    return {
      ad: state.ads[ownProps.id],
      cats: state.cats.byId,
      isFav: getFavsById(state)[ownProps.id],
      account: state.account,
      isBlacklisted: getBlacklistById(state)[ownProps.id],
    }
  }, (dispatch, ownProps) => {
    const id = ownProps.id

    return {
      loadAd: async (e) => {
        e && e.preventDefault()
        
        await dispatch(getAd(id))
        dispatch(getAdDetails(id))
      },
      onShowAdDetails: () => {
        window.location.hash = `#osliki-classi/ad/${id}`
        //dispatch(showAd(id))
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
        dispatch(openUpAdDialog(id))
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
