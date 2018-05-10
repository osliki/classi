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


// const account = window.web3.eth.defaultAccount
// let account
// web3.eth.getAccounts((err, accounts) => account = alert(accounts[0]))

// var account = web3.eth.accounts[0]

// var account = window.web3.eth.defaultAccount
// setInterval(() => {
//   if (window.web3.eth.defaultAccount !== account) {
//     account = web3.eth.accounts[0]
//     alert('New account = ' + account)
//     subscribers.forEach(callback => callback(account))
//   }
// }, 1000)

var account = ''
const loop = async () => {
  let accounts
  try {
    accounts = await web3.eth.getAccounts()
  } catch(error) {
    console.log('loop', error)
  }

  if (accounts[0] !== account) {
console.log('onChangeAccount')
    account = accounts[0]
    subscribers.forEach(callback => callback(account))
  }

  setTimeout(loop, 1000)
}

loop()

const subscribers = []
const onChangeAccount = (callback) => {
  subscribers.push(callback)
}

export {
  contract,
  contractToken,
  web3,
  account, // fallback
  onChangeAccount
}
