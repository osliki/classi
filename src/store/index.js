import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {
  cats: [], //{id, name, adsCount}
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
    allIds: [0, 2, 5],
  },
  ads: {
    byId: {
      0: {
        eth: {
          loading: false,
          error: undefined,
          data: {},
        },
        bzz: {
          loading: false,
          error: undefined,
          data: {},
        },
      }
    },
    allIds: [0],
  }
}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    thunk
  )
)

export default store
