import React, { Component } from 'react';
import {connect} from 'react-redux'

import './index.css';

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

import AdForm from '../AdForm'

import {showAdForm, initDraft} from '../../store/actions'

class EmptyColumn extends Component {
  handleClickOpen = () => {
    this.setState({ open: true });
  }

  render() {
    const {newAd} = this.props

    return (
      <section className="EmptyColumn">
        <ul>
          <li>
            <a href="">Ads from a category</a>
          </li>
          <li>
            <a href="">Ads from an user</a>
          </li>
          <li>
            <a href="">Favorite ads</a>
          </li>
          <li>
            <a href="">My ads</a>
          </li>
          <li>
            <a href="">Black list</a>
          </li>
          <li>
            <Button onClick={newAd}>New ad</Button>
          </li>
        </ul>

      </section>
    );
  }
}

export default connect((state, ownProps) => {
    return {

    }
  }, (dispatch, ownProps) => {
    return {
      newAd: () => {
        dispatch(initDraft('new'))
        dispatch(showAdForm('new'))
      }
    }
})(EmptyColumn)
