import {contract, web3} from '../provider'
import dotProp from 'dot-prop-immutable'

const getColumnAdsLoading = (columnId) => ({
  type: 'getColumnAdsLoading',
  columnId,
})

const getColumnAdsReceive = (columnId, ads) => ({
  type: 'getColumnAdsReceive',
  columnId,
  ads,
})

export const getColumnAds = (columnId, max = 2) => async (dispatch, getState) => {
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

  if (ads.byId[id])
    return

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


/*
export const getCats = async ({ catsCount, cats }) => {
  const freshCatsCount = await contract.methods.getCatsCount()
  if (freshCatsCount === catsCount) {
    return { cats }
  } else {

    //const freshCatsCount = await contract.methods.getCatsCount()
  }
}
*/
