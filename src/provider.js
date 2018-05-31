import oslikiClassifieds from './contracts/OslikiClassifieds.json'
import oslikToken from './contracts/OslikToken.json'

//import IPFS from 'ipfs'

const network = process.env.NODE_ENV === 'production' ? 'main' : 'rinkeby'

const contractAbi = oslikiClassifieds.abi
const contractAddress = oslikiClassifieds.networks[network].address

const contractTokenAbi = oslikToken.abi
const contractTokenAddress = oslikToken.networks[network].address

let web3, contract, contractToken, onChangeAccount, account, getIpfs

if (window.web3) {
  web3 = new window.Web3(window.web3.currentProvider)

  contract = new web3.eth.Contract(contractAbi, contractAddress)
  contractToken = new web3.eth.Contract(contractTokenAbi, contractTokenAddress)

  //web3.bzz.setProvider('http://swarm-gateways.net')

  const subscribers = []
  onChangeAccount = (callback) => {
    subscribers.push(callback)
  }

  const loop = async () => {
    let accounts
    try {
      accounts = await web3.eth.getAccounts() // if tab is opened on open browser, getAccounts never return result and loop will die
      console.log('accounts[0]', accounts[0])
    } catch(error) {
      console.log('loop', error)
    }

    if (accounts && accounts[0] !== account) {
      account = accounts[0]
      subscribers.forEach(callback => callback(account))
    }

    setTimeout(loop, 2000)
  }

  loop()


  /*** IPFS  ***/

  const config = {
    repo: 'osliki-classi',
    EXPERIMENTAL: {
      pubsub: true,
      relay: {
        enabled: true,
        hop: {
          enabled: true,
          //active: true
        }
      }
    },
    config: {
      Addresses: {
        Swarm: [
          '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        ]
      },
      Bootstrap: [
        '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
        '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
        '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
        '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
        '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
        '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
        '/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
        '/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
        '/dns4/bootstrap.osliki.net/tcp/443/wss/ipfs/QmfJB77qXfiEdJkaSxpZgiMh9kAPiDBj3ga7TxF72QdWtf',
        '/p2p-circuit/ipfs/QmfJB77qXfiEdJkaSxpZgiMh9kAPiDBj3ga7TxF72QdWtf',
      ]
    }
  }

  let ipfs = new window.Ipfs(config)

  ipfs.on('error', (error) => {
    console.error('js-ipfs node errored', error)
  })

  ipfs.on('start', () => {
    ipfs.id().then(i=>console.log('ipfs id', i))
    ipfs.swarm.peers().then(i=>console.log('ipfs peers', i))
    console.log('ipfs Online status: ', ipfs.isOnline() ? 'online' : 'offline')
    ipfs.bootstrap.list().then(i=>console.log('ipfs list', i))
  })

  //
  // ipfs.once('ready', async () => {
  //   // ipfs.start()
  //   /*ipfs.once('start', () => {
  //     timeout()
  //   })*/
  // })
  /*
  const timeout = () => {
    setTimeout(async () => {
        ipfs.stop()
        ipfs.once('stop', () => {
          ipfs.start()
          ipfs.once('start', () => {
            timeout()
          })
        })
      }, 60000)
  }*/

  getIpfs = () => {
    return new Promise(resolve => {
      if (ipfs.isOnline()) {
        resolve(ipfs)
      } else {
        ipfs.once('start', () => {
          resolve(ipfs)
        })
      }
    })
  }

}

export {
  contract,
  contractToken,
  web3,
  account,
  onChangeAccount,
  getIpfs
}
