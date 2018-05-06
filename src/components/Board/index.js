import React, {Component} from 'react'
import {connect} from 'react-redux'
import './index.css'

import Column from '../Column'
import EmptyColumn from '../EmptyColumn'
import AdDetailsDialog from '../Ad/AdDetailsDialog'
import AdFormDialog from '../AdForm/AdFormDialog'

class Board extends Component {
  render() {
    const {columns} = this.props

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

/*  <Column category={1} />
  <Column user="0x7aFCDbF97DDA2699de5E93365F93F69d52Ba97B0" />*/

export default connect(state => {
  return {
    columns: state.columns,
  }
})(Board)
