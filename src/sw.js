import Ipfs from 'ipfs'
import { createProxyServer } from 'ipfs-postmsg-proxy'

const configs = {
  repo: 'osliki-classi',
  EXPERIMENTAL: {
    pubsub: true,
    relay: {
      enabled: true,
      hop: {
        enabled: true,
        active: true
      }
    }
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        // '/p2p-circuit',
      ]
    }
  }
}

let ipfs

/* start a IPFS node within the service worker */
const startNode = () => {
  ipfs = new Ipfs(configs)
  ipfs.on('error', (error) => {
    throw new Error('js-ipfs node errored', error)
  })

  ipfs.on('ready', () => {
    console.info('SW js-ipfs node in the service worker is ready')

    ipfs.id().then(i=>console.log('ipfs id', i))
    ipfs.swarm.peers().then(i=>console.log('SW ipfs peers', i))
    console.log('SW ipfs Online status: ', ipfs.isOnline() ? 'online' : 'offline')
    ipfs.bootstrap.list().then(i=>console.log('SW ipfs list', i))

  })
}

/* Install service worker */
self.addEventListener('install', (event) => {
  console.info('SW service worker is being installed')
  event.waitUntil(self.skipWaiting())
})

/* Activate service worker */
self.addEventListener('activate', (event) => {
  console.info('SW service worker is being activated')
  startNode()
  event.waitUntil(self.clients.claim())
})

console.log('SW createProxyServer')

createProxyServer(() => ipfs, {
  addListener: self.addEventListener.bind(self),
  removeListener: self.removeEventListener.bind(self),
  postMessage: async (data) => {
    // TODO: post back to the client that sent the message?
    const clients = await self.clients.matchAll()
    clients.forEach(client => client.postMessage(data))
  }
})

//https://stackoverflow.com/questions/29741922/prevent-service-worker-from-automatically-stopping?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
setInterval(() => {
  if (!ipfs) return

  console.log('SW ipfs Online status: ', ipfs.isOnline() ? 'online' : 'offline')
  ipfs.id().then(i=>console.log('ipfs id', i))
  ipfs.swarm.peers().then(i=>console.log('SW ipfs peers', i))
  ipfs.bootstrap.list().then(i=>console.log('SW ipfs list', i))
}, 5000)
