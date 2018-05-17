import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'
import union from 'lodash/union'

import rootReducer from './reducers'
import {loadState, saveState} from './localStorage'
/*
const initialState = {
  cats: {  //{id, name, adsCount}
    byId: {}
  },
  ads: {
    byId: {}
  },
  ad: {
    id: null,
    zoom: false,
    opened: false
  },
  adForm: {
    draftId: null,
    opened: false
  },
  account: {
    address: '',
    tokenAmount: 0, //amount
    tokenApproved: 0, ///
    tokenPrice: 0,
    upPrice: 0,
    loading: false,
    error: null
  },
  approveTokenDialog: {
    opened: false
  },

  columns: {
    byId: {},
    allIds: [7],
  },
  drafts: {},
  favs: [5, 12, 0],
  blacklist: [12],
  transactions: {},
}
*/

const persistedState = loadState()
console.log('persistedState = ', persistedState)



const treatmentState = (state) => {
  try {
    state.blacklist = union(state.blacklist || [], [])

    state.columns.allIds.forEach(id => {
      state.columns.byId[id] = {...state.columns.byId[id], ...{
        loading: false,
        total: 0,
        newAdsCount: 0,
        ads: []
      }}
    })

    Object.keys(state.drafts).forEach(draftId => {
      state.drafts[draftId] = {...state.drafts[draftId], ...{
        uploadingImgs: 0,
        loading: false
      }}
    })

    return state
  } catch(error) {
    return undefined
  }
}

const store = createStore(
  rootReducer,
  treatmentState(persistedState),
  applyMiddleware(
    thunk
  )
)

store.subscribe(throttle(() => {
  const {columns, drafts, favs, blacklist, transactions} = store.getState()

  saveState({columns, drafts, favs, blacklist, transactions})
}, 1000))

export default store
