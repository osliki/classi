import oslikiClassifieds from './contracts/OslikiClassifieds.json'
import oslikToken from './contracts/OslikToken.json'

const contractAbi = oslikiClassifieds.abi
const contractAddress = oslikiClassifieds.networks['5777'].address

const contractTokenAbi = oslikToken.abi
const contractTokenAddress = oslikToken.networks['5777'].address

const web3 = new window.Web3(window.web3.currentProvider)

const contract = new web3.eth.Contract(contractAbi, contractAddress)
const contractToken = new web3.eth.Contract(contractTokenAbi, contractTokenAddress)

web3.bzz.setProvider('http://swarm-gateways.net')

const subscribers = []
const onChangeAccount = (callback) => {
  subscribers.push(callback)
}

var account = ''
const loop = async () => {
  let accounts
  try {
    accounts = await web3.eth.getAccounts() // if tab is opened on open browser, getAccounts never return result and loop will die
  } catch(error) {
    console.log('loop', error)
  }

  if (accounts[0] !== account) {
    account = accounts[0]
    subscribers.forEach(callback => callback(account))
  }

  setTimeout(loop, 1000)
}

loop()

export {
  contract,
  contractToken,
  web3,
  account, // fallback
  onChangeAccount
}
