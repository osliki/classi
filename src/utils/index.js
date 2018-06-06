import React from 'react'
import ImageTools from './ImageTools'
import blobToBuffer from 'blob-to-buffer'

export const cut = (text = '', max) => {
  return text.substr(0, max) + (text.length > max ? '...' : '')
}

export const getUserShort = (user) => {
  return (user ? `@${user.substr(2, 2)}...${user.substr(38)}` : '...')
}

export const getTxName = (tx = {}, txHash, placeLink = false) => {
  const {purpose, payload = {}} = tx
  const {draft = {}, from = ''} = payload // just in case

  let name = `Transaction ${txHash}`

  switch(purpose) {
    case 'newAd':
      name = `New Ad "${draft.header}"`
      break

    case 'editAd':
      name = `Edit Ad "${draft.header}"`
      break

    case 'upAd':
      name = (placeLink ?
          <span>Up <a href={`#osliki-classi/ad/${payload.id}`}>Ad #{payload.id}</a></span>
        :
          `Up Ad #${payload.id}`
      )
      break

    case 'approveToken':
      name = `dApp authorization from ${getUserShort(from)}`
      break

    case 'newComment':
      name =  (placeLink ?
          <span>New comment for <a href={`#osliki-classi/ad/${payload.adId}`}>Ad #{payload.adId}</a></span>
        :
          `New comment for Ad #${payload.adId}`
      )
      break
  }

  return name
}

export const getPreview = (file, ipfs) => {
  return new Promise((resolve, reject) => {
    ImageTools.resize(file, {width: 600, height: 600}, (previewBlob, didItResize) => {
      if (!didItResize) {
        resolve()
        return
      }

      console.log('getPreview previewBlob', previewBlob)

      // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
      blobToBuffer(previewBlob, async (err, previewBuffer) => {
        if (err) {
          reject(err)
          return
        }

        console.log('getPreview previewBuffer', previewBuffer)

        const res = await ipfs.files.add(previewBuffer)
        const hash = res[0].path

        console.log('preview hash', hash)

        kickIpfs(hash)

        resolve(hash)
      })
    })
  })
}

export const kickIpfs = (hash) => {
  fetch(`https://gateway.osliki.net/ipfs/${hash}`)
    .then(res => console.log(`fetch ipfs ${hash}`, res))
    .catch(error => console.error(`fetch ipfs ${hash}`, error))

  fetch(`https://ipfs.infura.io/ipfs/${hash}`)
    .then(res => console.log(`fetch ipfs ${hash}`, res))
    .catch(error => console.error(`fetch ipfs ${hash}`, error))
}
