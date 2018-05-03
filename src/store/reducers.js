import { combineReducers } from 'redux'
import dotProp from 'dot-prop-immutable'

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
        eth: {
          loading: false,
          error: null,
          data: {},
        },
        bzz: {
          loading: false,
          error: null,
          data: {},
        },
      })
    case 'newAdId':
      return dotProp.merge(state, `ads.allIds`, [action.id])

    case 'getAdLoading':
console.log('DISPLATCH getAdLoading')
      return dotProp.set(state, `byId.${action.id}.${action.from}`, {
        loading: true,
        error: null,
        data: {},
      })
    case 'getAdError':
      return dotProp.set(state, `byId.${action.id}.${action.from}`, {
        loading: false,
        error: action.error,
        data: {},
      })
    case 'getAdSuccess':
      return dotProp.set(state, `byId.${action.id}.${action.from}`, {
        loading: false,
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
    case 'receiveColumnAds':
      return  dotProp.set(state, `byId.${action.columnId}.ads`, action.ads)
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
