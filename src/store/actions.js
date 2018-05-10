import {contract, contractToken, web3} from '../provider'
import dotProp from 'dot-prop-immutable-chain'


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

  for (let id = 0; id < catsCount; id++) {
    dispatch(getCat(id))
  }
}



/*** Columns ***/

export const newColumn = (typeColumn, param) => ({
  type: 'newColumn',
  typeColumn,
  param
})

export const removeColumn = (columnId) => ({
  type: 'removeColumn',
  columnId
})

const getColumnAdsLoading = (columnId) => ({
  type: 'getColumnAdsLoading',
  columnId
})

const getColumnAdsSuccess = (columnId, ads, total) => ({
  type: 'getColumnAdsSuccess',
  columnId,
  ads,
  total
})

const getColumnAdsError = (columnId, error) => ({
  type: 'getColumnAdsError',
  columnId,
  error
})

export const getColumnAds = (columnId, max = 3) => async (dispatch, getState) => {
  console.log('getColumnAds', columnId)

  const column = getState().columns.byId[columnId]

  if (column.type === 'fav') return

  const getAds = async function getAds(totalMethod, getMethod) {
    const param = column.param

    let total = await (totalMethod === 'getAdsCount' ?
      contract.methods[totalMethod]() :
      contract.methods[totalMethod](param)
    ).call()

    total = Number(total)
    let ads = []

    if (total === 0) return {ads, total}

    let start = total - 1 - column.ads.length
    if (start < 0) start = 0

    let end =  start - max
    if (end < 0) end = -1

    let promises = []
console.log('start = ' +start, 'end = ' +end, 'total = ' +total)
    for (let index = start; index > end; index--) {
      getMethod ?
        promises.push(contract.methods[getMethod](param, index).call()) :
        ads.push(index)
    }

    if (promises.length) // important!!!
      ads = await Promise.all(promises)

    return {ads, total}
  }

  dispatch(getColumnAdsLoading(columnId))

  let res

  try {
    switch(column.type) {
      case 'all':
        res = await getAds('getAdsCount')
        break

      case 'user':
        res = await getAds('getAdsCountByUser', 'getAdIdByUser')
        break

      case 'cat':
        res = await getAds('getAdsCountByCat', 'getAdIdByCat')
        break
    }
  } catch (error) {
    dispatch(getColumnAdsError(columnId, error))
    return
  }

  dispatch(getColumnAdsSuccess(columnId, res.ads, res.total))
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
  dispatch(adFormStart(draftId))

  const {header, text, photos, catName, catId, id} = getState().drafts[draftId]

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

  let request

  if (id === '') {
    if (catId === '') {
      request = contract.methods.newCatWithAd(catName, hash).send({
        from,
        gasPrice: web3.utils.toWei('1', 'gwei'),
        gas: 300000
      })
    } else {
      request = contract.methods.newAd(catId, hash).send({
        from,
        gasPrice: web3.utils.toWei('1', 'gwei'),
        gas: 300000
      })
    }
  } else {
    request = contract.methods.editAd(id, hash).send({
      from,
      gasPrice: web3.utils.toWei('1', 'gwei'),
      gas: 100000
    })
  }

  request.on('receipt', receipt => {
    console.log('receipt', receipt)
    dispatch(adFormSuccess(draftId))
    dispatch(closeAdForm())
  }).on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber === 5)
      console.log('confirmationNumber', receipt)
  }).on('error', (error, receit) => {
    console.log('error', error, receit)
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

  contract.methods.upAd(id).send({
    from,
    gasPrice: web3.utils.toWei('1', 'gwei'),
    gas: 100000
  }).on('receipt', (receipt) => {
    console.log('receipt', receipt)
  }).on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber === 5)
      console.log('confirmationNumber', receipt)

  }).on('error', (error, receit) => {
    console.log('error', error, receit)
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

  contractToken.methods.approve(contract._address, web3.utils.toWei(String(amount), 'ether')).send({
    from,
    gasPrice: web3.utils.toWei('1', 'gwei'),
    gas: 50000
  }).on('receipt', (receipt) => {
    console.log('receipt', receipt)
    dispatch(closeApproveTokenDialog())
  }).on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber === 8) {
      console.log('confirmationNumber', receipt)
      dispatch(getAccount())
    }
  }).on('error', (error, receit) => {
    console.log('error', error, receit)
    dispatch(closeApproveTokenDialog())
  })
}
