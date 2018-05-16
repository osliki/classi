export const cut = (text = '', max) => {
  return text.substr(0, max) + (text.length > max ? '...' : '')
}

export const getUserShort = (user) => {
  return (user ? `@${user.substr(2, 2)}...${user.substr(38)}` : '...')
}

export const getTxName = (tx = {}, txHash) => {
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
      name = `Up Ad #${payload.id}`
      break
    case 'approveToken':
      name = `dApp authorization from ${getUserShort(from)}`
      break
    case 'newComment':
      name = `New comment #${draft.adId}`
      break
  }

  return name
}
