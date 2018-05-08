import {contract, web3, account} from '../provider'
import dotProp from 'dot-prop-immutable-chain'



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
  dispatch(getCatLoading(id))

  let name, adsCount

  try {
    [name, adsCount] = await Promise.all([
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

  //let promises = []
  for (let id = 0; id < catsCount; id++) {
    dispatch(getCat(id))
    //promises.push(getCat(id))
  }

  //return Promise.all(promises)
}


export const removeColumn = (columnId) => ({
  type: 'removeColumn',
  columnId
})

export const newColumn = (typeColumn, param) => ({
  type: 'newColumn',
  typeColumn,
  param
})

const getColumnAdsLoading = (columnId) => ({
  type: 'getColumnAdsLoading',
  columnId,
})

const getColumnAdsReceive = (columnId, ads) => ({
  type: 'getColumnAdsReceive',
  columnId,
  ads,
})

export const getColumnAds = (columnId, max = 20) => async (dispatch, getState) => {
  const column = getState().columns.byId[columnId]

  const getAds = async (totalMethod, getMethod) => {
    const param = column.param

    // or else throw error
    const total = await (totalMethod === 'getAdsCount' ?
      contract.methods[totalMethod]() :
      contract.methods[totalMethod](param)
    ).call()

    let last = column.ads.length - 1
    if (last < 0) last = 0

    let start = total - 1 - last
    if (start < 0) start = 0

    let end =  start - max
    if (end < 0) end = 0

    let promises = [], ads = []
    for (let index = start; index >= end; index--) {
      getMethod ? promises.push(contract.methods[getMethod](param, index).call()) : ads.push(index)
    }

    if (promises.length)
      ads = await Promise.all(promises)

    return ads
  }

  dispatch(getColumnAdsLoading(columnId))

  let ads = []
  switch(column.type) {
    case 'all': {
      ads = await getAds('getAdsCount')
      break
    } case 'user': {
      ads = await getAds('getAdsCountByUser', 'getAdIdByUser')
      break
    } case 'cat': {
      ads = await getAds('getAdsCountByCat', 'getAdIdByCat')
      break
    }
  }

  dispatch(getColumnAdsReceive(columnId, ads))
}



const initNewAd = (id) => ({
  type: 'initNewAd',
  id,
})

const newAdId = (id) => ({
  type: 'newAdId',
  id,
})

const getAdLoading = (from, id) => ({
  type: 'getAdLoading',
  from,
  id,
})

const getAdError = (from, id, error) => ({
  type: 'getAdError',
  from,
  id,
  error,
})

const getAdSuccess = (from, id, ad) => ({
  type: 'getAdSuccess',
  from,
  id,
  ad,
})

export const getAd = (id) => async (dispatch, getState) => {
  const ads = getState().ads
/*
  if (ads.byId[id])
    return*/

  dispatch(initNewAd(id))
  dispatch(newAdId(id))

  //if (!ads.allIds.includes(id)) // just in case

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
  if (!contentAddress)
    return

  const loading = dotProp.get(ads, `byId.${id}.bzz.loading`)
  if (loading)
    return

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
  } catch(err) {
    dispatch(adFormError(draftId, err))
  }

  if (!hash) return

  let request

  if (id === '') {
    if (catId === '') {
      request = contract.methods.newCatWithAd(catName, hash).send({
        from: account,
        gasPrice: web3.utils.toWei('1', 'gwei'),
        gas: 300000
      })
    } else {
      request = contract.methods.newAd(catId, hash).send({
        from: account,
        gasPrice: web3.utils.toWei('1', 'gwei'),
        gas: 300000
      })
    }
  } else {
    request = contract.methods.editAd(id, hash).send({
      from: account,
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
