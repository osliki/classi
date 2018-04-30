import React, { Component } from 'react';
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

class EmptyColumn extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
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
            <a href="">My ads</a>
          </li>
          <li>
            <a href="">Black list</a>
          </li>
          <li>
            <Button onClick={this.handleClickOpen}>New ad</Button>
          </li>
        </ul>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
        >
          <AdForm />
          <Button onClick={this.handleClose}>
              Cancel
              </Button>
        </Dialog>
      </section>
    );
  }
}

export default EmptyColumn;
