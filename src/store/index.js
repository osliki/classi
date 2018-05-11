import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'
import union from 'lodash/union'
import dotProp from 'dot-prop-immutable-chain'

import rootReducer from './reducers'
import {loadState, saveState} from './localStorage'

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
    byId: {
      0: {
        id: 0,
        type: 'all',
        loading: false,
        ads: [],
      },
      2: {
        id: 2,
        type: 'user',
        param: '0x35ceA1d89B0b6A5d1EeDc45D6317933613ff0d5A',
        ads: [],
      },
      5: {
        id: 5,
        type: 'cat',
        param: 3,
        ads: [],
      },
      7: {
        id: 7,
        type: 'fav'
      }
    },
    allIds: [7],
  },
  drafts: {},
  favs: [5, 12, 0],
  blacklist: [12],
  transactions: {},
}

const persistedState = loadState()
persistedState.blacklist = union(persistedState.blacklist || [], [1, 4])
console.log('persistedState = ', persistedState)
const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(
    thunk
  )
)

store.subscribe(throttle(() => {
  const {columns, drafts, favs, blacklist, transactions} = store.getState()

  let cleanedColumns = columns
  columns.allIds.forEach(id => {
    cleanedColumns = dotProp(cleanedColumns)
      .merge(`byId.${id}`, {
        loading: false,
        ads: []
      })
      .value()
  })

  saveState({columns: cleanedColumns, drafts, favs, blacklist, transactions})
}, 1000))

export default store
