import oslikiClassifieds from './contracts/OslikiClassifieds.json'

const contractAddress = oslikiClassifieds.networks['5777'].address
const contractAbi = oslikiClassifieds.abi

const web3 = new window.Web3(window.web3.currentProvider)
const contract = new web3.eth.Contract(contractAbi, contractAddress)

web3.bzz.setProvider('http://swarm-gateways.net')

const account = window.web3.eth.defaultAccount

export {
  contract,
  web3,
  account
}
