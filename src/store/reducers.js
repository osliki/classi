import {combineReducers} from 'redux'
import dotProp from 'dot-prop-immutable-chain'

const cats = (state = {
  byId: {},  //{id, name, adsCount, loading, error}
  loading: false
}, action) => {
  switch (action.type) {
    case 'initNewCat':
      return dotProp(state)
        //.merge(`allIds`, [action.id])
        .set(`byId.${action.id}`, {
          id: action.id,
          name: '',
          adsCount: 0,
          loading: true,
          error: null
        })
        .value()

    case 'getCatLoading':
      return dotProp(state)
        .merge(`byId.${action.id}`, {
          loading: false,
          error: null
        })
        .value()

    case 'getCatError':
      return dotProp(state)
        .merge(`byId.${action.id}`, {
          loading: false,
          error: action.error
        })
        .value()

    case 'getCatSuccess':
      return dotProp(state)
        .merge(`byId.${action.id}`, {
          name: action.name,
          adsCount: action.adsCount,
          loading: false,
          error: null
        })
        .value()

    case 'getCatsLoading':
      return dotProp(state)
        .set('loading', true)
        .value()

    case 'getCatsSuccess':
      console.log('new cats', action.cats)
      return dotProp(state)
        .set('loading', false)
        .merge('byId', action.cats)
        .value()

    default:
      return state
  }
}

export const getDefaultAd = (id) => {
  return {
    id: id,
    eth: {
      loading: false,
      loaded: false,
      error: null,
      data: {},
    },
    bzz: {
      loading: false,
      loaded: false,
      error: null,
      data: {},
    },
  }
}

const ads = (state = {}, action) => {
  switch (action.type) {
    case 'initNewAd':
      return dotProp(state)
        //.merge(`allIds`, [Number(action.id)])
        .set(action.id, getDefaultAd(action.id))
        .value()

    case 'removeAd':
      // const loading =
      //   dotProp(state).get(`${action.id}.eth.loading`).value() ||
      //   dotProp(state).get(`${action.id}.bzz.loading`).value()
      //
      // if (loading) return state // to avoid bugs with concurent request
      //
      console.log('garbage removeAd', action.id)
      return dotProp(state)
        .delete(action.id)
        .value()

    case 'getAdLoading':
      return dotProp(state)
        .merge(`${action.id}.${action.from}`, {
          loading: true,
          loaded: false,
          error: null
        })
        .value()

    case 'getAdError':
      if (!dotProp(state).get(action.id).value()) return state // if ad is deleted

      return dotProp(state)
        .merge(`${action.id}.${action.from}`, {
          loading: false,
          loaded: false,
          error: action.error
        })
        .value()

    case 'getAdSuccess':
      if (!dotProp(state).get(action.id).value()) return state // if ad is deleted

      return dotProp(state)
        .set(`${action.id}.${action.from}`, {
          loading: false,
          loaded: true,
          error: null,
          data: action.ad,
        })
        .value()

    case 'updateCmntsCnt':
      const cmntsCnt = dotProp(state).get(`${action.adId}.eth.data.cmntsCnt`).value()
console.log('updateCmntsCnt', cmntsCnt, action.cmntsCnt)
      if (cmntsCnt === undefined || cmntsCnt === action.cmntsCnt) return state

      return dotProp(state)
        .set(`${action.adId}.eth.data.cmntsCnt`, Number(action.cmntsCnt))
        .value()

    default:
      return state
  }
}

const columns = (state = {
  byId: {},
  allIds: []
}, action) => {
  switch (action.type) {

    case 'newColumn':
      const newColumnId = state.allIds.length ? Math.max(...state.allIds) + 1 : 0

      return dotProp(state)
        .merge(`allIds`, [newColumnId])
        .set(`byId.${newColumnId}`, {
          id: newColumnId,
          type: action.typeColumn,
          param: action.param,
          loading: false,
          error: null,
          ads: [],
          total: 0,
          newAds: 0
        })
        .value()

    case 'removeColumn':
      const removeIndex = state.allIds.findIndex((el) => el === action.columnId)

      return dotProp(state)
        .delete(`allIds.${removeIndex}`)
        .delete(`byId.${action.columnId}`)
        .value()

    case 'removeColumnAds':
      return  dotProp(state)
        .merge(`byId.${action.columnId}`, {
          ads: [],
          total: 0
        })
        .value()

    case 'getColumnAdsLoading':
      return dotProp(state)
        .merge(`byId.${action.columnId}`, {
          loading: true,
          error: null
        })
        .value()

    case 'getColumnAdsError':
      if (!dotProp(state).get(`byId.${action.columnId}`).value()) return state // if column is deleted

      return dotProp(state)
        .merge(`byId.${action.columnId}`, {
          loading: false,
          error: action.error
        })
        .value()

    case 'getColumnAdsSuccess':
      if (!dotProp(state).get(`byId.${action.columnId}`).value()) return state // if column is deleted

      let newState = dotProp(state)
        .merge(`byId.${action.columnId}`, {
          loading: false,
          error: null,
          total: action.total
        })
        .value()

      if (action.ads.length) {
        const newAds = action.ads.map(id => String(id)) // column all trys to save numbers
        const oldAds = dotProp(newState).get(`byId.${action.columnId}.ads`).value()
        const newAdsCount = dotProp(newState).get(`byId.${action.columnId}.newAdsCount`).value()

        newState = dotProp(newState)
          .merge(`byId.${action.columnId}`, {
            ads: (action.which === 'old' ? [...oldAds, ...newAds] : [...newAds, ...oldAds]),
            newAdsCount: (action.which === 'new' ? 0 : newAdsCount)
          })
          .value()
      }

      return newState

    case 'updateColumnNewAdsCount':
      const total = dotProp(state).get(`byId.${action.columnId}.total`, 0).value()
      const newAdsCount = dotProp(state).get(`byId.${action.columnId}.newAdsCount`).value()

      if (newAdsCount === (total - action.total)) return state
      console.log('updateColumnNewAdsCount', total, action.total)

      return  dotProp(state)
        .set(`byId.${action.columnId}.newAdsCount`, action.total - total)
        .value()

    default:
      return state
  }
}

const ad = (state = {
  id: null,
  zoom: false,
  opened: false
}, action) => {
  switch (action.type) {
    case 'showAd':
      return {
        ...state,
        id: action.id,
        opened: true
      }

    case 'closeAd':
      return {
        ...state,
        opened: false
      }

    case 'zoomAd':
      return {
        ...state,
        zoom: true
      }

    case 'unzoomAd':
      return {
        ...state,
        zoom: false
      }

    default:
      return state
  }
}

const adForm = (state = {
  draftId: null,
  opened: false
}, action) => {
  switch (action.type) {
    case 'showAdForm':
      return {
        ...state,
        draftId: action.draftId,
        opened: true
      }

    case 'closeAdForm':
      console.log('closeAdForm')
      return {
        ...state,
        opened: false
      }

    default:
      return state
  }
}

const getDefaultDraft = () => ({
  id: '',
  catId: '',
  catName: '',
  header: '',
  text: '',
  agree: false,
  photos: [],
  uploadingImgs: 0,
  loading: false,
  error: null
})

const getDefaultCommentDraft = () => ({
  text: '',
  loading: false,
  error: null
})

const drafts = (state = {}, action) => {
  const id = action.draftId

  switch (action.type) {
    case 'initDraft':
      if (state[id]) return state // ?????

      const defaultDraft = (id === 'comment' ? getDefaultCommentDraft() : getDefaultDraft())

      return dotProp(state)
        .set(id, action.data ? {...defaultDraft, ...action.data} : defaultDraft)
        .value()

    case 'adFormStart': // rename formStart
      return dotProp(state)
        .set(`${id}.loading`, true)
        .set(`${id}.error`, null)
        .value()

    case 'adFormSuccess':
      return dotProp(state)
        .delete(id)
        .value()

    case 'adFormError':
      return dotProp(state)
        .set(`${id}.loading`, false)
        .set(`${id}.error`, action.error)
        .value()

    case 'adFormChange':
      return dotProp(state)
        .set(`${id}.${action.name}`, action.value)
        .value()

    case 'adFormPhotoUploadStart':
      return dotProp(state)
        .set(`${id}.uploadingImgs`, (v) => v + action.length)
        .value()

    case 'adFormPhotoUploadSuccess':
      return dotProp(state)
        .set(`${id}.uploadingImgs`, (v) => {
          const newVal = v - 1
          return newVal < 0 ? 0 : newVal // if concurrent requests
        })
        .merge(`${id}.photos`, [action.hash])
        .value()

    case 'adFormPhotoUploadError':
      return dotProp(state)
        .set(`${id}.uploadingImgs`, (v) => {
          const newVal = v - 1
          return newVal < 0 ? 0 : newVal
        })
        .value()

    case 'adFormPhotoRemove':
      return dotProp(state)
        .delete(`${id}.photos.${action.index}`)
        .value()

    default:
      return state
  }
}

const favs = (state = [], action) => {
  switch (action.type) {
    case 'addFav':
    console.log('addFavaddFavaddFav', state, action.adId)
      if (state.find(el => el === action.adId) === undefined)
        return [...state, action.adId]
      else
        return state

    case 'removeFav':
      const removeIndex = state.findIndex(el => el === action.adId)
      console.log('removeFavremoveFav', state, removeIndex)

      return dotProp(state)
        .delete(removeIndex)
        .value()

    default:
      return state
  }
}

const account = (state = {
  address: '',
  tokenBalance: 0,
  tokenAllowance: 0,
  tokenPrice: 0,
  upPrice: 0,
  loading: false,
  error: null
}, action) => {
  switch (action.type) {
    case 'accountLoading':
      return {
        ...state,
        loading: true,
        error: null
      }

    case 'accountError':
      return {
        ...state,
        loading: false,
        error: action.error
      }

    case 'accountSuccess':
      //const {address, tokenBalance, tokenAllowance, tokenPrice, upPrice} = action.data

      return {
        ...state,
        ...action.data,
        loading: false,
        error: null
      }

    case 'accountUpdate':
      return {
        ...state,
        ...action.data
      }

    default:
      return state
  }
}


const approveTokenDialog = (state = {
  opened: false
}, action) => {
  switch (action.type) {
    case 'openApproveTokenDialog':
      return {
        ...state,
        opened: true,
        loading: false
      }

    case 'closeApproveTokenDialog':
      return {
        ...state,
        opened: false,
        loading: false
      }

    case 'approveTokenDialogLoading':
      return {
        ...state,
        loading: true
      }

    case 'approveTokenDialogError':
      return {
        ...state,
        loading: false
      }

    default:
      return state
  }
}


const upAdDialog = (state = {
  opened: false,
  loading: false,
  id: ''
}, action) => {
  switch (action.type) {
    case 'openUpAdDialog':
      return {
        ...state,
        opened: true,
        loading: false,
        id: action.id
      }

    case 'closeUpAdDialog':
      return {
        ...state,
        opened: false
      }

    case 'upAdDialogLoading':
      return {
        ...state,
        loading: true
      }

    case 'upAdDialogError':
      return {
        ...state,
        loading: false
      }

    default:
      return state
  }
}


const blacklist = (state = [], action) => {
  switch (action.type) {
    case 'addToBL':

      if (state.includes(action.id)) return state

      return [
        ...state,
        action.id
      ]

    case 'removeFromBL':
      const removeIndex = state.findIndex(el => el === action.id)

      if (removeIndex < 0) return state

      return dotProp(state)
        .delete(removeIndex)
        .value()

    default:
      return state
  }
}

const transactions = (state = {}, action) => {
  switch (action.type) {
    case 'addTx':
      return dotProp(state)
        .set(action.txHash, {
          purpose: action.purpose,
          payload: action.payload,
          status: 'pending'
        })
        .value()

    case 'removeTx':
      return dotProp(state)
        .delete(action.txHash)
        .value()

    case 'updateTxStatus':
      if (!dotProp(state).get(action.txHash).value()) return state // if tx is deleted

      return dotProp(state)
        .merge(action.txHash, {
          status: action.status
        })
        .value()

    default:
      return state
  }
}


const txsMenu = (state = {
  opened: false
}, action) => {
  switch (action.type) {
    case 'openTxsMenu':
      return {
        ...state,
        opened: true
      }

    case 'closeTxsMenu':
      return {
        ...state,
        opened: false
      }

    default:
      return state
  }
}


const getDefaultComment = (id) => {
  return {
    id: id,
    eth: {
      error: null,
      data: {},
    },
    bzz: {
      loaded: false,
      error: null,
      data: {},
    },
  }
}


const comments = (state = {
  adId: null,
  loading: false,
  error: null,
  byId: {},
  allIds: []
}, action) => {
  switch (action.type) {
    case 'initComment':
      return dotProp(state)
        .set(`byId.${action.id}`, getDefaultComment(action.id))
        .value()

    case 'getCommentError':
      if (!dotProp(state).get(`byId.${action.id}`).value()) return state

      return dotProp(state)
        .merge(`byId.${action.id}.${action.from}`, {
          error: action.error
        })
        .value()

    case 'getCommentSuccess':
      if (!dotProp(state).get(`byId.${action.id}`).value()) return state

      return dotProp(state)
        .merge(`byId.${action.id}.${action.from}`, {
          loaded: true,
          data: action.data
        })
        .value()

    case 'getCommentsLoading':
      console.log('getCommentsLoading', action.adId)
      return {...state,
        loading: true,
        error: null,
        adId: action.adId
      }

    case 'getCommentsError':
      if (state.adId !== action.adId) return state // means user hasn't waited response

      return {...state,
        loading: false,
        error: action.error
      }

    case 'getCommentsSuccess':
      console.log('getCommentsSuccess', state.adId, action.adId)
      if (state.adId !== action.adId) return state // means user hasn't waited response

      return {...state,
        loading: false,
        error: null,
        allIds: action.cmntIds
      }

    case 'updateCmntIds':
      if (state.adId !== action.adId) return state // means user hasn't waited response

      return dotProp(state)
        .merge('allIds', action.cmntIds)
        .value()

    default:
      return state
  }
}


const touDialog = (state = {
  opened: false
}, action) => {
  switch (action.type) {
    case 'openTouDialog':
      return {
        ...state,
        opened: true
      }

    case 'closeTouDialog':
      return {
        ...state,
        opened: false
      }

    default:
      return state
  }
}


const rootReducer = combineReducers({
  cats,
  ads,
  columns,
  ad,
  adForm,
  drafts,
  favs,
  account,
  approveTokenDialog,
  upAdDialog,
  blacklist,
  transactions,
  txsMenu,
  comments,
  touDialog,
})

export default rootReducer


/*
  "83e98c64136dd783b783de62636c05b0a166f222218b7c1bfabf386e0f9da384",
  "fc70151dd834403a7c5d5ef2c53b62ea824344de19f8d2fa96b1cddc5799df46",
  "fdea35dc83be2483e7e6715bd0e25080e172097c61730c414dd4b88152965a10",
  "83e98c64136dd783b783de62636c05b0a166f222218b7c1bfabf386e0f9da384",
  "c002c1376964309a9647d4830bdeae0b84d42b7f5651675e37493f56cf5b7e28",
*/
