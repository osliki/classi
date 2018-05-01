import { initStore } from 'react-waterfall'

import storeActions from './actions'
//import { _score } from './selectors'


import oslikiClassifieds from '../contracts/OslikiClassifieds.json'

const contractAddress = oslikiClassifieds.networks['5777'].address
const contractAbi = oslikiClassifieds.abi

const web3 = new window.Web3(window.web3.currentProvider)
console.dir(window.Web3.givenProvider)
web3.bzz.setProvider('http://swarm-gateways.net')

const store = {
  initialState: {
    web3,

    contract: new web3.eth.Contract(contractAbi, contractAddress),
    account: window.web3.eth.defaultAccount,
    cats: [], //{id, name, adsCount}
    catsCount: 0,
  },
  actions: storeActions,
}

// a middleware that calls _selector every time an action is triggered
// this could be integrated by default in a future version
function derivedDataProposal(store, self) {
  const isDerived = action => action.startsWith('_')

  return function(action) {
    if (isDerived(action)) return

    Object.keys(actions)
      .filter(isDerived)
      .forEach(action => actions[action](self.state))
  }
}

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe,
} = initStore(
  store,
  derivedDataProposal,
)
