import React, {Component} from 'react'
import {connect} from 'react-redux'
import './index.css'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'

import Column from '../Column'
import EmptyColumn from '../EmptyColumn'
import AdDetailsDialog from '../Ad/AdDetailsDialog'
import AdFormDialog from '../AdForm/AdFormDialog'

import {getCats} from '../../store/actions'

class Board extends Component {
  componentWillMount() {
    this.props.getCats()
  }

  render() {
    const {columns} = this.props
console.dir(columns)
    return (
      <main className="Board">
          {columns.allIds.map(id => (
            <Column key={id} id={id} />
          ))}

          <EmptyColumn />

        <AdFormDialog/>
        <AdDetailsDialog/>
      </main>
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
