import {contract, contractToken, web3} from '../provider'
import dotProp from 'dot-prop-immutable-chain'
import {getBlacklistById} from './selectors'

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

const getCatsSuccess = (names, adsCounts) => ({
  type: 'getCatsSuccess',
  names,
  adsCounts
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

export const getCats = () => async (dispatch, getState) => {
  const catsCount = await contract.methods.getCatsCount().call()

  let promisesCat = [],
    promisesCount = []

  for (let id = 0; id < catsCount; id++) {
    promisesCat.push(contract.methods.catsRegister(id).call())
    promisesCount.push(contract.methods.getAdsCountByCat(id).call())
  }

  const names = await Promise.all(promisesCat)
  const adsCounts = await Promise.all(promisesCount)

  dispatch(getCatsSuccess(names, adsCounts))
}



/*** Columns ***/

export const newColumn = (typeColumn, param) => {
  //getColumnAds
/*
new ads in all
new ads in cat
new cat in user
*/

  switch(typeColumn) {
    case 'all':
      /*console.log('column all new event add')
      //https://github.com/MetaMask/metamask-extension/issues/3642
      contract.events.EventNewAd({}, (error, event)=>{console.log('EventNewAd', error)})
        .on('data', (event) => {
          console.log('column all new event data', event)
        })
        .on('changed', function(event){
          console.log('column all new event changed', event)
            // remove event from local database
        })
        .on('error', console.error);*/

      break;

    case 'user':

      break;

    case 'cat':

      break;
  }

  return {
    type: 'newColumn',
    typeColumn,
    param
  }
}

export const removeColumn = (columnId) => ({
  type: 'removeColumn',
  columnId
})

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

export const getColumnAds = (columnId, which = 'old', max = 3) => async (dispatch, getState) => {
  console.log('getColumnAds', columnId)

  const column = getState().columns.byId[columnId]

  if (column.loading || column.type === 'fav') return

  dispatch(getColumnAdsLoading(columnId))

  const getOldAds = async (totalMethod, getMethod) => {
    console.log('getOldAds')

    let total = column.total

    if (!total) {
      total = await (totalMethod === 'getAdsCount' ?
        contract.methods.getAdsCount() :
        contract.methods[totalMethod](column.param)
      ).call()

      total = Number(total)
    }

    let start = total - 1 - column.ads.length // if < 0, for will be skipped

    let end = start - max
    if (end < 0) end = -1

    return {total, start, end}
  }

  const getNewAds = async (totalMethod) => {
    const columnTotal = column.total

    let total = await (totalMethod === 'getAdsCount' ?
      contract.methods.getAdsCount() :
      contract.methods[totalMethod](column.param)
    ).call()

    total = Number(total)

    let start = total - 1
    let end = columnTotal - 1

    return {total, start, end}
  }

  const procedure = (which === 'old' ? getOldAds : getNewAds)

  let res
  let ads = []

  try {
    let getMethod

    switch(column.type) {
      case 'all':
        res = await procedure('getAdsCount')
        break

      case 'user':
        res = await procedure('getAdsCountByUser')
        getMethod = 'getAdIdByUser'
        break

      case 'cat':
        res = await procedure('getAdsCountByCat')
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



/*** Ad Data ***/

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
  //onst ads = getState().ads
  //if (!ads.allIds.includes(id)) // just in case

  dispatch(initNewAd(id))

  const blacklist = getState().blacklist

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

  const contentAddress = dotProp.get(ads, `byId.${id}.eth.data.text`)
  if (!contentAddress) {
    dispatch(getAdError('bzz', id, new Error('Text is empty.')))
    return
  }

  const loading = dotProp.get(ads, `byId.${id}.bzz.loading`)
  if (loading) return

  dispatch(getAdLoading('bzz', id))

  let adDetails = {}, adDetailsRaw
  try {
    adDetailsRaw = await web3.bzz.download(contentAddress)
    adDetails = JSON.parse(new TextDecoder("utf-8").decode(adDetailsRaw))
  } catch(err) {
    dispatch(getAdError('bzz', id, err))
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
      const data = new Uint8Array(e.target.result)

      web3.bzz.upload(data).then(hash => {
        dispatch(adFormPhotoUploadSuccess(draftId, hash))
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
    hash = await web3.bzz.upload(JSON.stringify({
      header,
      text,
      photos
    }))

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
