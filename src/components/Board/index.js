import React, {Component} from 'react'
import {connect} from 'react-redux'
import './index.css'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'

import PerfectScrollbar from 'react-perfect-scrollbar'

import Column from '../Column'
import EmptyColumn from '../EmptyColumn'
import AdDetailsDialog from '../Ad/AdDetailsDialog'
import AdFormDialog from '../AdForm/AdFormDialog'
import ApproveTokenDialog from '../ApproveTokenDialog'

import {getCats} from '../../store/actions'

class Board extends Component {
  componentWillMount() {
    this.props.getCats()
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

          <AdFormDialog/>
          <AdDetailsDialog/>
          <ApproveTokenDialog/>
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
    }
  }
})(Board)
