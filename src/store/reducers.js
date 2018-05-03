import { combineReducers } from 'redux'
import dotProp from 'dot-prop-immutable-chain'

const cats = (state = [], action) => {
  switch (action.type) {
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
      return dotProp.set(state, `byId.${action.id}`, {
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
    case 'newAdId':
      return dotProp.merge(state, `ads.allIds`, [Number(action.id)])

    case 'getAdLoading':
      return dotProp.set(state, `byId.${action.id}.${action.from}`, {
        loading: true,
        loaded: false,
        error: null,
        data: {},
      })
    case 'getAdError':
      return dotProp.set(state, `byId.${action.id}.${action.from}`, {
        loading: false,
        loaded: false,
        error: action.error,
        data: {},
      })
    case 'getAdSuccess':
      return dotProp.set(state, `byId.${action.id}.${action.from}`, {
        loading: false,
        loaded: true,
        error: null,
        data: action.ad,
      })

    default:
      return state
  }
}

const columns = (state = {
  byId: {},
  allIds: []
}, action) => {
  switch (action.type) {
    case 'getColumnAdsLoading':
      return dotProp.set(state, `byId.${action.columnId}.loading`, true)
    case 'getColumnAdsReceive':
      return dotProp(state)
        .set(`byId.${action.columnId}.loading`, false)
        .set(`byId.${action.columnId}.ads`, action.ads.map(id => Number(id)))
        .value()
    default:
      return state
  }
}

const rootReducer = combineReducers({
  cats,
  ads,
  columns,
})

export default rootReducer
