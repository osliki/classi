import { combineReducers } from 'redux'
import dotProp from 'dot-prop-immutable-chain'

const cats = (state = {
  byId: {},  //{id, name, adsCount, loading, error}
  allIds: []
}, action) => {
  switch (action.type) {
    case 'initNewCat':
      return dotProp(state)
        .merge(`allIds`, [action.id])
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

    /*case 'catNewAdsCount':
      return dotProp(state)
        .set(`byId.${action.id}.adsCount`, action.adsCount)
        .value()*/

    default:
      return state
  }
}

const ads = (state = {
  byId: {},
  allIds: []
}, action) => {
  switch (action.type) {
    case 'initNewAd':
      return dotProp(state)
        .merge(`allIds`, [Number(action.id)])
        .set(`byId.${action.id}`, {
          id: action.id,
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
        })
        .value()

    case 'getAdLoading':
      return dotProp(state)
        .merge(`byId.${action.id}.${action.from}`, {
          loading: true,
          loaded: false,
          error: null
        })
        .value()

    case 'getAdError':
      return dotProp(state)
        .merge(`byId.${action.id}.${action.from}`, {
          loading: false,
          loaded: false,
          error: action.error
        })
        .value()

    case 'getAdSuccess':
      return dotProp(state)
        .set(`byId.${action.id}.${action.from}`, {
          loading: false,
          loaded: true,
          error: null,
          data: action.ad,
        })
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
    console.log('newColumn')
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
          total: 0
        })
        .value()

    case 'removeColumn':
      const removeIndex = state.allIds.findIndex((el) => el === action.columnId)

      return dotProp(state)
        .delete(`allIds.${removeIndex}`)
        .delete(`byId.${action.columnId}`)
        .value()

    case 'getColumnAdsLoading':
      return dotProp(state)
        .merge(`byId.${action.columnId}`, {
          loading: true,
          error: null
        })
        .value()

    case 'getColumnAdsError':
      return dotProp(state)
        .merge(`byId.${action.columnId}`, {
          loading: false,
          error: action.error
        })
        .value()

    case 'getColumnAdsSuccess':
      let newState = dotProp(state)
        .merge(`byId.${action.columnId}`, {
          loading: false,
          error: null,
          total: action.total
        })
        .value()

      if (action.ads.length)
        newState = dotProp(newState)
          .merge(`byId.${action.columnId}.ads`, action.ads.map(id => Number(id)))
          .value()

      return newState

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
  photos: [],
  uploadingImgs: 0,
  loading: false,
  error: null
})

const drafts = (state = getDefaultDraft(), action) => {
  const id = action.draftId

  switch (action.type) {
    case 'initDraft':
      if (state[id]) return state

      return dotProp(state)
        .set(id, action.data ? {...getDefaultDraft(), ...action.data} : getDefaultDraft())
        .value()

    case 'adFormStart':
      return dotProp(state)
        .set(`${id}.loading`, true)
        .set(`${id}.error`, null)
        .value()

    case 'adFormSuccess':
      return getDefaultDraft()

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
        .set(`${id}.uploadingImgs`, (v) => v - 1)
        .merge(`${id}.photos`, [action.hash])
        .value()

    case 'adFormPhotoUploadError':
      return dotProp(state)
        .set(`${id}.uploadingImgs`, (v) => v - 1)
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
        .delete(`${removeIndex}`)
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
        opened: true
      }

    case 'closeApproveTokenDialog':
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
  approveTokenDialog
})

export default rootReducer


/*
  "83e98c64136dd783b783de62636c05b0a166f222218b7c1bfabf386e0f9da384",
  "fc70151dd834403a7c5d5ef2c53b62ea824344de19f8d2fa96b1cddc5799df46",
  "fdea35dc83be2483e7e6715bd0e25080e172097c61730c414dd4b88152965a10",
  "83e98c64136dd783b783de62636c05b0a166f222218b7c1bfabf386e0f9da384",
  "c002c1376964309a9647d4830bdeae0b84d42b7f5651675e37493f56cf5b7e28",
*/
