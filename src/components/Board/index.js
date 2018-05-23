import React, {Component} from 'react'
import {connect} from 'react-redux'

import './index.css'

import PerfectScrollbar from 'react-perfect-scrollbar'

import Column from '../Column'
import EmptyColumn from '../EmptyColumn'
import AdDetailsDialog from '../Ad/AdDetailsDialog'
import AdFormDialog from '../AdForm/AdFormDialog'
import ApproveTokenDialog from '../ApproveTokenDialog'
import UpAdDialog from '../UpAdDialog'
import TouDialog from '../TouDialog'

import {getCats, showAd, closeAd} from '../../store/actions'

class Board extends Component {

  constructor(props) {
    super(props)

    this.props.getCats()

    this.pattern = /#osliki-classi\/ad\/([0-9]*)/i
    window.addEventListener('hashchange', this.onHashChange, false)
    this.onHashChange()
  }

  onHashChange = () => {
    const hash = window.location.hash
    if (this.pattern.test(hash)) {
      const params = hash.match(this.pattern)
      this.props.showAd(params[1])
    } else {
      this.props.closeAd()
    }
  }

  render() {
    const {columns} = this.props

    return (
      <PerfectScrollbar
        option={{suppressScrollY: true}}
      >
        <main className="Board">
          {columns.allIds.map(id => (
            <Column key={id} id={id} />
          ))}

          <EmptyColumn />

          <AdFormDialog />
          <AdDetailsDialog />
          <ApproveTokenDialog />
          <UpAdDialog />
          <TouDialog />
        </main>
      </PerfectScrollbar>
    )
  }
}

export default connect((state) => {
  return {
    columns: state.columns,
  }
}, (dispatch, ownProps) => {
  return {
    getCats: () => {
      dispatch(getCats())
    },
    showAd: (adId) => dispatch(showAd(adId)),
    closeAd: () => dispatch(closeAd())
  }
})(Board)
