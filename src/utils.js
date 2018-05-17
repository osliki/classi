import React from 'react'

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
