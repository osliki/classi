import {contract, contractToken, web3, ipfs} from '../provider'
import dotProp from 'dot-prop-immutable-chain'
import {getBlacklistById, getCatsCount} from './selectors'
import union from 'lodash/union'
import throttle from 'lodash/throttle'


/*** Cats ***/

const initNewCat = (id) => ({
  type: 'initNewCat',
  id
})

const getCatLoading = (id) => ({
  type: 'getCatLoading',
  id
})

const getCatError = (id, error) => ({
  type: 'getCatError',
  id,
  error
})

const getCatSuccess = (id, name, adsCount) => ({
  type: 'getCatSuccess',
  id,
  name,
  adsCount
})

const getCatsLoading = () => ({
  type: 'getCatsLoading'
})

const getCatsSuccess = (cats) => ({
  type: 'getCatsSuccess',
  cats
})

export const getCat = (id) => async (dispatch, getState) => {
  let name, adsCount

  dispatch(initNewCat(id))
  dispatch(getCatLoading(id))

  try {
    ;[name, adsCount] = await Promise.all([
      contract.methods.catsRegister(id).call(),
      contract.methods.getAdsCountByCat(id).call()
    ])
  } catch(err) {
    dispatch(getCatError(id, err))
    return
  }

  dispatch(getCatSuccess(id, name, adsCount))
}

export const getCats = (start = 0, catsCount) => async (dispatch, getState) => {
  dispatch(getCatsLoading())

  if (!catsCount)
    catsCount = await contract.methods.getCatsCount().call()

  let promisesCat = [],
    promisesCount = [],
    ids = []

  for (let id = start; id < catsCount; id++) {
    promisesCat.push(contract.methods.catsRegister(id).call())
    promisesCount.push(contract.methods.getAdsCountByCat(id).call())
    ids.push(id)
  }

  const names = await Promise.all(promisesCat)
  const adsCounts = await Promise.all(promisesCount)

  let cats = {}
  ids.forEach((id, index) => {
    cats[id] = {
      id,
      name: names[index],
      adsCount: adsCounts[index]
    }
  })

  dispatch(getCatsSuccess(cats)) // it changes loading !!!
}


export const checkNewCats = /*throttle(*/() => async (dispatch, getState) => {
  if (getState().cats.loading) return

  const localCount = getCatsCount(getState())
  const realCount = await contract.methods.getCatsCount().call()

  console.log('checkNewCats', localCount, realCount)

  if (localCount < realCount) dispatch(getCats(localCount, realCount))
}/*, 2000)*/


/*** Columns ***/

export const checkNewAds = (columnId) => async (dispatch, getState) => {
  const {type, param} = dotProp(getState()).get(`columns.byId.${columnId}`, {}).value()
  const total = await getTotalAds(type, param)

  dispatch(updateColumnNewAdsCount(columnId, total))
}

export const updateColumnNewAdsCount = (columnId, total) => ({
  type: 'updateColumnNewAdsCount',
  columnId,
  total
})

export const newColumn = (typeColumn, param) => ({
  type: 'newColumn',
  typeColumn,
  param
})

export const removeColumn = (columnId) => ({
  type: 'removeColumn',
  columnId
})

export const removeColumnAds = (columnId) => ({
  type: 'removeColumnAds',
  columnId
})

export const refreshColumn = (columnId) => (dispatch, getState) => {
  const ads = dotProp(getState()).get(`columns.byId.${columnId}.ads`, []).value()

  dispatch(removeColumnAds(columnId))

  //ads.forEach(id => dispatch(removeAd(id))) // if removeAd then got problem with blnk ads and bouncing scroll in columns
  dispatch(purgeAds()) // if some ads duplicated in others column they won't be reloaded (expect reload all ads)

  dispatch(getColumnAds(columnId))
}

const getColumnAdsLoading = (columnId) => ({
  type: 'getColumnAdsLoading',
  columnId
})

const getColumnAdsSuccess = (columnId, which, ads, total) => ({
  type: 'getColumnAdsSuccess',
  columnId,
  which,
  ads,
  total
})

const getColumnAdsError = (columnId, error) => ({
  type: 'getColumnAdsError',
  columnId,
  error
})

const getTotalAds = async (type, param) => {
  let method = ''

  switch(type) {
    case 'all':
      method = 'getAdsCount'
      break

    case 'user':
      method = 'getAdsCountByUser'
      break

    case 'cat':
      method = 'getAdsCountByCat'
      break
  }

  const total = await (method === 'getAdsCount' ?
    contract.methods.getAdsCount() :
    contract.methods[method](param)
  ).call()

  return Number(total)
}

export const getColumnAds = (columnId, which = 'old', max = 3) => async (dispatch, getState) => {
  console.log('getColumnAds', columnId)

  const column = getState().columns.byId[columnId]

  if (column.loading) return
  if (column.type === 'fav') {
    // dispatch(getColumnAdsSuccess(columnId, which, getState().favs, getState().favs.length)) // in this case fav dont react on changes
    return
  }

  dispatch(getColumnAdsLoading(columnId))

  const getOldAdsParams = async (type) => {
    let total = column.total

    if (!total) {// means refresh or new column
      total = await getTotalAds(type, column.param)
      dispatch(checkNewCats())
    }

    let start = total - 1 - column.ads.length // if < 0, for will be skipped

    let end = start - max
    if (end < 0) end = -1

    console.log('getOldAdsParams', {total, start, end})
    return {total, start, end}
  }

  const getNewAdsParams = async (type) => {
    const columnTotal = column.total

    let total = await getTotalAds(type, column.param)

    let start = total - 1
    let end = columnTotal - 1
    console.log('getNewAdsParams', {total, start, end})
    dispatch(checkNewCats())
    return {total, start, end}
  }

  const procedure = (which === 'old' ? getOldAdsParams : getNewAdsParams)

  let res
  let ads = []

  try {
    let getMethod
    res = await procedure(column.type)

    switch(column.type) {
      case 'user':
        getMethod = 'getAdIdByUser'
        break

      case 'cat':
        getMethod = 'getAdIdByCat'
        break
    }

    const {start, end} = res

    let promises = []

    for (let index = start; index > end; index--) {
      getMethod ?
        promises.push(contract.methods[getMethod](column.param, index).call()) :
        ads.push(index)
    }

    if (promises.length) // important!!!
      ads = await Promise.all(promises)

  } catch (error) {
    dispatch(getColumnAdsError(columnId, error))
    return
  }

  dispatch(getColumnAdsSuccess(columnId, which, ads, res.total))
}

export const purgeAds = () => (dispatch, getState) => {
  let adsMatter = [], favsShown = false
  const allAds = Object.keys(getState().ads)

  getState().columns.allIds.forEach(columnId => {
    const column = dotProp(getState()).get(`columns.byId.${columnId}`, {}).value()
    const {type, ads=[]} = column

    adsMatter = union(adsMatter, ads)

    if (type === 'fav') favsShown = true
  })

  if (favsShown) {
    adsMatter = union(adsMatter, getState().favs)
  }

  const garbage = allAds.filter(id => !adsMatter.includes(id)) // allAds - adsMatter

  console.log('garbage Ads', garbage, adsMatter)

  garbage.forEach(id => dispatch(removeAd(id)))

  console.log('garbage Ads remains', Object.keys(getState().ads))
}


/*** Ad Data ***/

const removeAd = (id) => ({
  type: 'removeAd',
  id
})

const initNewAd = (id) => ({
  type: 'initNewAd',
  id
})

const getAdLoading = (from, id) => ({
  type: 'getAdLoading',
  from,
  id
})

const getAdError = (from, id, error) => ({
  type: 'getAdError',
  from,
  id,
  error
})

const getAdSuccess = (from, id, ad) => ({
  type: 'getAdSuccess',
  from,
  id,
  ad
})

export const getAd = (id) => async (dispatch, getState) => {
  dispatch(initNewAd(id))

  if (getBlacklistById(getState())[id]) return

  dispatch(getAdLoading('eth', id))

  let newAd
  try {
    newAd = await contract.methods.ads(id).call()
  } catch(err) {
    dispatch(getAdError('eth', id, err))
    return
  }

  dispatch(getAdSuccess('eth', id, newAd))
}

export const getAdDetails = (id) => async (dispatch, getState) => {
  const ads = getState().ads
  const contentAddress = dotProp.get(ads, `${id}.eth.data.text`)

  if (!contentAddress) {
    dispatch(getAdError('bzz', id, new Error('Text is empty.')))
    return
  }

  const loading = dotProp.get(ads, `${id}.bzz.loading`)
  if (loading) return

  dispatch(getAdLoading('bzz', id))

  let adDetails = {}, adDetailsRaw
  try {
    // if (ipfs.util.isIPFS.multihash(contentAddress)) {
      adDetailsRaw = await ipfs.files.cat(contentAddress)
    /*} else {
      adDetailsRaw = await web3.bzz.download(contentAddress)
    }*/

    adDetails = JSON.parse(new TextDecoder("utf-8").decode(adDetailsRaw))

  } catch(error) {
    console.log('ipfs error', error)
    dispatch(getAdError('bzz', id, error))
    return
  }

  dispatch(getAdSuccess('bzz', id, adDetails))
}



/*** Ad Details ***/

export const showAd = (id) => ({
  type: 'showAd',
  id
})

export const closeAd = () => ({
  type: 'closeAd'
})

export const zoomAd = () => ({
  type: 'zoomAd'
})

export const unzoomAd = () => ({
  type: 'unzoomAd'
})



/*** Ad Form ***/

export const showAdForm = (draftId) => ({
  type: 'showAdForm',
  draftId
})

export const closeAdForm = () => ({
  type: 'closeAdForm'
})

export const initDraft = (draftId, data) => ({
  type: 'initDraft',
  draftId,
  data
})

export const adFormChange = (draftId, name, value) => ({
  type: 'adFormChange',
  draftId,
  name,
  value
})

export const adFormPhotoRemove = (draftId, index) => ({
  type: 'adFormPhotoRemove',
  draftId,
  index,
})

export const adFormPhotoUploadStart = (draftId, length) => ({
  type: 'adFormPhotoUploadStart',
  draftId,
  length,
})

export const adFormPhotoUploadSuccess = (draftId, hash) => ({
  type: 'adFormPhotoUploadSuccess',
  draftId,
  hash,
})

export const adFormPhotoUploadError = (draftId) => ({
  type: 'adFormPhotoUploadError',
  draftId
})

export const adFormPhotoUpload = (draftId, files) => async (dispatch, getState) => {
  dispatch(adFormPhotoUploadStart(draftId, files.length))

  Array.from(files).forEach(file => {
    const reader = new FileReader()

    reader.onload = (e) => {
      // const data = new Uint8Array(e.target.result)
      const data = new Buffer(e.target.result)

      /*web3.bzz.upload(data).then(hash => {
        dispatch(adFormPhotoUploadSuccess(draftId, hash))
      }).catch(err => {
        alert(`Error while uploading img ${file.name}`)

        dispatch(adFormPhotoUploadError(draftId))
      })*/

      ipfs.files.add(data).then(res => {
        console.log('ipfs.files.add', data, res)
        dispatch(adFormPhotoUploadSuccess(draftId, res[0].path))
      }).catch(err => {
        alert(`Error while uploading img ${file.name}`)

        dispatch(adFormPhotoUploadError(draftId))
      })


    }

    reader.readAsArrayBuffer(file);
  })
}

export const adFormStart = (draftId) => ({
  type: 'adFormStart',
  draftId
})

export const adFormSuccess = (draftId) => ({
  type: 'adFormSuccess',
  draftId
})

export const adFormError = (draftId, error) => ({
  type: 'adFormError',
  draftId,
  error
})

export const adFormSubmit = (draftId) => async (dispatch, getState) => {
  const draft = getState().drafts[draftId]
  const {header, text, photos, catName, catId, id = '', loading} = draft // id can be undefined

  if (loading) return

  dispatch(adFormStart(draftId))

  let hash
  try {
    /*hash = await web3.bzz.upload(JSON.stringify({
      header,
      text,
      photos
    }))*/

    const res = await ipfs.files.add(new Buffer(JSON.stringify({
      header,
      text,
      photos
    })))

    hash = res[0].path

    console.log("Uploaded file:", hash)
  } catch(error) {
    dispatch(adFormError(draftId, error))
    return
  }

  const from = getAccountAddress(getState(), (error) => dispatch(adFormError(draftId, new Error(error))))
  if (!from) return

  let gasPrice = await web3.eth.getGasPrice()
  gasPrice = web3.utils.fromWei(gasPrice, 'gwei')

  let request, purpose = ''

  if (id === '') {
    purpose = 'newAd'

    if (catId === '') {
      request = contract.methods.newCatWithAd(catName, hash).send({
        from,
        gasPrice,//: web3.utils.toWei('1', 'gwei'),
        gas: 500000 // catName can be long
      })
    } else {
      request = contract.methods.newAd(catId, hash).send({
        from,
        gasPrice,//: web3.utils.toWei('1', 'gwei'),
        gas: 300000
      })
    }
  } else {
    purpose = 'editAd'

    request = contract.methods.editAd(id, hash).send({
      from,
      gasPrice,//: web3.utils.fromWei(gasPrice, 'gwei'),
      gas: 100000
    })
  }

  request.on('transactionHash', (txHash) => {
    console.log('txHash', txHash)
    dispatch(addTx(txHash, purpose, {draft}))
    dispatch(adFormSuccess(draftId))
    dispatch(closeAdForm())
    dispatch(openTxsMenu())
    request.off('error') // another callback will handle it
  })/*.on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber === 5) {
      console.log('confirmationNumber', confirmationNumber)
      dispatch(getAccount()) // to update balance after reward (if 1 ad) + icon lock in appbar
    }
  })*/.on('error', (error, receipt) => {
    alert(error.message)
    dispatch(adFormError(draftId, error))
  })
}



/*** FAVS ***/

export const addFav = (adId) => ({
  type: 'addFav',
  adId
})

export const removeFav = (adId) => ({
  type: 'removeFav',
  adId
})



/*** Account ***/

export const accountLoading = () => ({
  type: 'accountLoading'
})

export const accountError = (error) => ({
  type: 'accountError',
  error
})

export const accountSuccess = (data) => ({
  type: 'accountSuccess',
  data
})

export const accountUpdate = (data) => ({
  type: 'accountUpdate',
  data
})

export const getAccount = () => async (dispatch, getState) => {
  dispatch(accountLoading())

  let address, tokenBalance, tokenAllowance, tokenPrice, upPrice

  try {
    const accounts = await web3.eth.getAccounts()

    address = accounts[0]

    ;[
      tokenBalance,
      tokenAllowance,
      upPrice
    ] = await Promise.all([
      contractToken.methods.balanceOf(address).call(),
      contractToken.methods.allowance(address, contract._address).call(),
      contract.methods.upPrice().call()
    ])
  } catch(error) {
    dispatch(accountError(error))
    return
  }

  dispatch(accountSuccess({
    address,
    tokenBalance,
    tokenAllowance,
    tokenPrice,
    upPrice
  }))

}



/*** Up Ad ***/

const getAccountAddress = (state, onError) => {
  const from = state.account.address

  if (!from) {
    const error = 'Your Ethereum address not available. Log in to MetaMask.'
    onError && onError(error)
    alert(error)
    return
  }

  return from
}

export const upAd = (id) => async (dispatch, getState) => {

  const {upPrice, tokenBalance, tokenAllowance} = getState().account

  const from = getAccountAddress(getState())
  if (!from) return

  if (upPrice > tokenAllowance) {
    dispatch(openApproveTokenDialog())
    return
  }

  if (upPrice > tokenBalance) {
    const error = 'Not enough OSLIK tokens. Buy more or get them as a bonus on your first Ad publication.'
    alert(error)
    return
  }

  let gasPrice = await web3.eth.getGasPrice()
  gasPrice = web3.utils.fromWei(gasPrice, 'gwei')

  const request = contract.methods.upAd(id).send({
    from,
    gasPrice,//: web3.utils.fromWei(gasPrice, 'gwei'),
    gas: 100000
  }).on('transactionHash', (txHash) => {
    console.log('txHash', txHash)
    dispatch(addTx(txHash, 'upAd', {id}))
    dispatch(openTxsMenu())
    request.off('error')
  })/*.on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber === 5) {
      console.log('confirmationNumber', confirmationNumber)
      dispatch(getAccount())
    }
  })*/.on('error', (error, receipt) => { // if receipt then out of gas
    alert(error.message)
  })
}



/*** ApproveTokenDialog ***/

export const openApproveTokenDialog = () => ({
  type: 'openApproveTokenDialog'
})

export const closeApproveTokenDialog = () => ({
  type: 'closeApproveTokenDialog'
})

export const approveToken = (amount = 10**8) => async (dispatch, getState) => {
  const from = getAccountAddress(getState())
  if (!from) return

  let gasPrice = await web3.eth.getGasPrice()
  gasPrice = web3.utils.fromWei(gasPrice, 'gwei')

  const request = contractToken.methods.approve(contract._address, web3.utils.toWei(String(amount), 'ether')).send({
    from,
    gasPrice, //: web3.utils.fromWei(gasPrice, 'gwei'),
    gas: 50000
  }).on('transactionHash', (txHash) => {
    console.log('txHash', txHash)
    dispatch(addTx(txHash, 'approveToken', {amount, from}))
    dispatch(openTxsMenu())
    dispatch(closeApproveTokenDialog())
    request.off('error')
  })/*.on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber === 5) {
      console.log('confirmationNumber', confirmationNumber)
      dispatch(getAccount())
    }
  })*/.on('error', (error, receipt) => {
    alert(error.message)
  })
}


/*** Blacklist ***/

export const addToBL = (id) => ({
  type: 'addToBL',
  id
})

export const removeFromBL = (id) => ({
  type: 'removeFromBL',
  id
})


/*** transactions ***/

export const addTx = (txHash, purpose, payload) => ({
  type: 'addTx',
  txHash,
  purpose,
  payload
})

export const removeTx = (txHash) => ({
  type: 'removeTx',
  txHash
})

export const updateTxStatus = (txHash, status) => ({
  type: 'updateTxStatus',
  txHash,
  status
})

export const getTxStatus = (txHash, onSuccess = () => {}, onFail = () => {}) => async (dispatch, getState) => {
  let status = 'pending'
  let confirmationNumber = 0

  const prevStatus = dotProp(getState()).get(`transactions.${txHash}.status`).value()

  const [/*tx, */receipt, curBlockNumber] = await Promise.all([
    //web3.eth.getTransaction(txHash),
    web3.eth.getTransactionReceipt(txHash),
    web3.eth.getBlockNumber()
  ])

  console.log('data', {txHash, receipt, curBlockNumber})

  if (receipt === null || receipt.blockNumber === null) {
    status = 'pending'
  } else {
    if (receipt.status === false) {
      status = 'failed'
    } else {
      confirmationNumber = curBlockNumber - receipt.blockNumber

      if (confirmationNumber < 2) {
        status = 'confirmation'
      } else {
        status = 'succeed'
      }
    }
  }

  if (prevStatus !== status) {
    dispatch(updateTxStatus(txHash, status))

    if (status === 'succeed') onSuccess()
    else if (status === 'failed') onFail()
  }

}



/*** Txs Menu ***/

export const openTxsMenu = () => ({
  type: 'openTxsMenu'
})

export const closeTxsMenu = () => ({
  type: 'closeTxsMenu'
})



/*** Comments ***/

export const getComments = (adId) => async (dispatch, getState) => {
  /*if (!total)
    total = await contract.methods.getCommentsCountByAd(adId)

  let promises, cids = []
  for (index = start; index < total; index++) {
    promises.push(contract.methods.getCommentsCountByAd(adId))
  }
*/

  dispatch(getCommentsLoading(adId))

  let cmntIds
  try {
    cmntIds = await contract.methods.getAllCommentIdsByAd(adId).call()
  } catch(error) {
    dispatch(getCommentsError(adId, error))
  }
console.log('getComments', adId, cmntIds)
  dispatch(getCommentsSuccess(adId, cmntIds))
}

export const getComment = (id) => async (dispatch, getState) => {
  dispatch(initComment(id))

  let comment
  try {
    comment = await contract.methods.comments(id).call()
    dispatch(getCommentSuccess(id, 'eth', comment))
  } catch(error) {
    dispatch(getCommentError(id, 'eth', error))
    return
  }

  let commentDetails
  try {
    const commentDetailsRaw = await ipfs.files.cat(comment.text)
    commentDetails = JSON.parse(new TextDecoder("utf-8").decode(commentDetailsRaw))
    dispatch(getCommentSuccess(id, 'bzz', commentDetails))
  } catch(error) {
    dispatch(getCommentError(id, 'bzz', error))
  }

}

export const addNewComment = (adId) => async (dispatch, getState) => {

}

export const getCommentsLoading = (adId) => ({
  type: 'getCommentsLoading',
  adId
})

export const getCommentsError = (adId, error) => ({
  type: 'getCommentsError',
  adId,
  error
})

export const getCommentsSuccess = (adId, cmntIds) => ({
  type: 'getCommentsSuccess',
  adId,
  cmntIds
})

export const getCommentError = (id, from, error) => ({
  type: 'getCommentError',
  id,
  from,
  error
})

export const getCommentSuccess = (id, from, data) => ({
  type: 'getCommentSuccess',
  id,
  from,
  data
})

export const initComment = (id) => ({
  type: 'initComment',
  id
})

export const commentSubmit = (adId) => async (dispatch, getState) => {
  const draftId = 'comment'
  const draft = getState().drafts[draftId]
  const {text, loading} = draft // id can be undefined

  if (loading) return // imposible situation in UI

  dispatch(adFormStart(draftId))

  let hash
  try {
    const res = await ipfs.files.add(new Buffer(JSON.stringify({
      text
    })))

    hash = res[0].path

    console.log("Uploaded file:", hash)
  } catch(error) {
    dispatch(adFormError(draftId, error))
    return
  }

  const from = getAccountAddress(getState(), (error) => dispatch(adFormError(draftId, new Error(error))))
  if (!from) return

  let gasPrice = await web3.eth.getGasPrice()
  gasPrice = web3.utils.fromWei(gasPrice, 'gwei')
console.log('newComment submit', {adId, hash})
  const request = contract.methods.newComment(adId, hash).send({
    from,
    gasPrice,
    gas: 250000
  })

  request.on('transactionHash', (txHash) => {
    console.log('txHash', txHash)
    dispatch(addTx(txHash, 'newComment', {draft}))
    dispatch(adFormSuccess(draftId))
    dispatch(openTxsMenu())
    dispatch(initDraft(draftId)) //cos user may be want add another comment right after submit
    request.off('error') // another callback will handle it
  }).on('error', (error, receipt) => {
    alert(error.message)
    dispatch(adFormError(draftId, error))
  })

}
