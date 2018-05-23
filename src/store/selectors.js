import {createSelector} from 'reselect';

export const getCatsCount = createSelector(
  (state) => state.cats.byId,
  (cats) => {
    console.log('RESELECT getCatsCount')

    return Object.keys(cats).length
  }
)

export const getCatsArray = createSelector(
  (state) => state.cats.byId,
  (cats) => {
    console.log('RESELECT getCatsArray')

    return Object.keys(cats).map(key => cats[key])
  }
)

export const getCatsByName = createSelector(
  (state) => state.cats.byId,
  (cats) => {
    console.log('RESELECT getCatsByName')

    let obj = {}
    Object.keys(cats).forEach(id => obj[cats[id].name] = cats[id])

    return obj
  }
)

export const getFavsById = createSelector(
  (state) => state.favs,
  (favs) => {
    console.log('RESELECT getFav', favs)

    let obj = {}
    favs.forEach(id => obj[id] = true)

    return obj
  }
)

export const getBlacklistById = createSelector(
  (state) => state.blacklist,
  (blacklist) => {
    console.log('RESELECT blacklist', blacklist)

    let obj = {}
    blacklist.forEach(id => obj[id] = true)

    return obj
  }
)



export const getScannedTx = createSelector(
  (state) => state.txs,
  (txs) => {
    console.log('RESELECT txs', txs)

    let arr = []

    Object.keys(txs).forEach(txHash => {
      const tx = txs[txHash] || {}

      if (tx.status === 'confirmation' || tx.status === 'pending') {
        arr.push(txHash)
      }
    })

    return arr
  }
)

export const getIsApprovePending = createSelector(
  (state) => state.txs,
  (state) => state.account,
  getScannedTx,
  (txs, account, scannedTxs) => {
    console.log('RESELECT getIsApprovePending', scannedTxs)

    return scannedTxs.some(txHash => {
      return txs[txHash].purpose === 'approveToken' && txs[txHash].payload.from === account.address
    })
  }
)
