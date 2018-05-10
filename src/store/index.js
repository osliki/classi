import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {
  cats: {  //{id, name, adsCount}
    byId: {},
    allIds: [],
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
      }
    },
    allIds: [],
  },
  ads: {
    byId: {},
    allIds: [],
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
  drafts: {},
  favs: [0],
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
  }

  /*,
  transactions: {
  }*/
}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    thunk
  )
)

export default store
