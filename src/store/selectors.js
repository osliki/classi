import {createSelector} from 'reselect';

export const getCatsArray = createSelector(
  (state) => state.cats,
  (cats) => {
    console.log('RESELECT getCatsArray')
    return Object.keys(cats).map((key) => cats[key])
  }
)

export const getCatsByName = createSelector(
  (state) => state.cats,
  (cats) => {
    console.log('RESELECT getCatsByName')
    let obj = {}
    Object.keys(cats).forEach((id) => obj[cats[id].name] = cats[id])

    return obj
  }
)
