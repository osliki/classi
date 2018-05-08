import React, { Component } from 'react';
import {connect} from 'react-redux'
import {account} from '../../provider'

import './index.css';

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import AddIcon from '@material-ui/icons/Add'

import AdForm from '../AdForm'
import CatsAutocomplete from '../AdForm/CatsAutocomplete'

import {getCatsArray, getCatsByName} from '../../store/selectors'
import {showAdForm, initDraft, newColumn} from '../../store/actions'

class EmptyColumn extends Component {

  constructor(props) {
    super(props)

    this.state = {
      opened: false,
      type: '',
      param: '',
      catValue: ''
    }
  }

  onSubmit = (e) => {
    if (e) e.preventDefault()

    const {type, param} = this.state

    this.props.onAdd(type, param)

    this.setState({
      opened: false
    })
  }

  onClose = () => {
    this.setState({
      opened: false
    })
  }

  newColumn = (type) => {
    const {onAdd} = this.props

    switch (type) {
      case 'all':
        onAdd('all')
        return

      case 'my':
        onAdd('user', account)
        return

      case 'fav':
        onAdd('fav')
        return
    }

    this.setState({
      opened: true,
      type: type,
      param: '',
      catValue: ''
    })
  }

  render() {
    const {newAd, catsArray} = this.props
    const {opened, catValue, type, param} = this.state

    return (
      <section className="EmptyColumn">

        <List component="nav">

          <ListItem button onClick={() => this.newColumn('all')}>
            <ListItemText>
              New 'all' column
            </ListItemText>
          </ListItem>

          <ListItem button onClick={() => this.newColumn('my')}>
            <ListItemText>
              New 'my' column
            </ListItemText>
          </ListItem>

          <ListItem button onClick={() => this.newColumn('fav')}>
            <ListItemText>
              New 'fav' column
            </ListItemText>
          </ListItem>

          <ListItem button onClick={() => this.newColumn('cat')}>
            <ListItemText>
              New 'category' column
            </ListItemText>
          </ListItem>

          <ListItem button onClick={() => this.newColumn('user')}>
            <ListItemText>
              New 'user' column
            </ListItemText>
          </ListItem>

          <ListItem button onClick={newAd}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>

            <ListItemText>
              Create Ad
            </ListItemText>
          </ListItem>
        </List>

        <Dialog
          open={opened}
          onClose={this.onClose}
          classes={{paper: 'new-column-dialog'}}
        >
          <DialogTitle>New Column</DialogTitle>

          <DialogContent classes={{root: 'new-column-dialog-content'}}>
            <form onSubmit={this.onSubmit}>
              {type === 'cat'
                ?
                  <CatsAutocomplete
                    items={catsArray}
                    inputValue={catValue}
                    onInputChange={(e) => {
                      this.setState({catValue: e.target.value})
                    }}
                    onChange={(selectedItem) => {
                      this.setState({param: selectedItem.id}, () => {
                        this.onSubmit()
                        this.onClose()
                      })
                    }}
                  />
                :
                  <TextField
                    name="user"
                    label="User (ethereum address 0x...)"
                    margin="normal"
                    fullWidth
                    required
                    value={param}
                    onChange={(e) => this.setState({param: e.target.value})}
                  />
              }
            </form>
          </DialogContent>

            {type === 'cat'
              ?
                null
              :
                <DialogActions>
                  <Button onClick={this.onClose}>
                    Cancel
                  </Button>
                  <Button onClick={this.onSubmit}>
                    Add
                  </Button>
                </DialogActions>
            }


        </Dialog>

      </section>


      /*<section className="EmptyColumn">
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

      </section>*/
    );
  }
}

export default connect((state, ownProps) => {
    return {
      catsArray: getCatsArray(state)
    }
  }, (dispatch, ownProps) => {
    return {
      onAdd: (type, param) => {
        dispatch(newColumn(type, param))
      },
      newAd: () => {
        dispatch(initDraft('new'))
        dispatch(showAdForm('new'))
      }
    }
})(EmptyColumn)
