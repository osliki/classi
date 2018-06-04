import React, { Component } from 'react';
import {connect} from 'react-redux'

import './index.css';

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AddIcon from '@material-ui/icons/Add'

import CatsAutocomplete from '../AdForm/CatsAutocomplete'

import {getCatsArray} from '../../store/selectors'
import {showAdForm, initDraft, newColumn, checkNewCats} from '../../store/actions'

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
    const {onAdd, address, checkNewCats} = this.props

    switch (type) {
      case 'all':
        onAdd('all')
        return

      case 'my':
        onAdd('user', address)
        return

      case 'fav':
        onAdd('fav')
        return

      case 'cat':
        checkNewCats()
        break
    }

    this.setState({ // open dialog if not all my or user
      opened: true,
      type: type,
      param: '',
      catValue: ''
    })
  }

  render() {
    const {newAd, cats, catsLoading, favsLength} = this.props
    const {opened, catValue, type, param} = this.state

    console.log('RENDER EmptyColumn')
    return (
      <section className="EmptyColumn">

        <List component="nav">

          <ListItem title="Recently posted ads" button onClick={() => this.newColumn('all')}>
            <ListItemText>
              New 'all' column
            </ListItemText>
          </ListItem>

          <ListItem title="Ads from a category" button onClick={() => this.newColumn('cat')}>
            <ListItemText>
              New 'category' column
            </ListItemText>
          </ListItem>

          {favsLength ?
            <ListItem title="Favorite ads" button onClick={() => this.newColumn('fav')}>
              <ListItemText>
                New 'fav' column
              </ListItemText>
            </ListItem>
          :
            null
          }

          {/*<ListItem button onClick={() => this.newColumn('user')}>
            <ListItemText>
              New 'user' column
            </ListItemText>
          </ListItem>*/}

          <ListItem title="Your ads" button onClick={() => this.newColumn('my')}>
            <ListItemText>
              New 'my' column
            </ListItemText>
          </ListItem>

          <ListItem button onClick={newAd}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>

            <ListItemText style={{padding: '0px'}}>
              Poste Ad
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
                    items={[...getCatsArray({cats})]}
                    inputValue={catValue}
                    inputRef={el => el && el.focus()}
                    catsLoading={catsLoading}
                    label="Choose a category"
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
                    inputRef={el => el && el.focus()}
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
    )
  }
}

export default connect((state, ownProps) => {
    return {
      //catsArray: getCatsArray(state),
      cats: state.cats,
      catsLoading: state.cats.loading,
      address: state.account.address,
      favsLength: state.favs.length
    }
  }, (dispatch, ownProps) => {
    return {
      onAdd: (type, param) => {
        dispatch(newColumn(type, param))

      },
      newAd: () => {
        dispatch(initDraft('new'))
        dispatch(showAdForm('new'))
      },
      checkNewCats: () => {
        dispatch(checkNewCats())
      }
    }
})(EmptyColumn)


/*

{address
  ?
    <ListItem button onClick={() => this.newColumn('my')}>
      <ListItemText>
        New 'my' column
      </ListItemText>
    </ListItem>
  :
    null
}

{address
  ?
    <ListItem button onClick={newAd}>
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>

      <ListItemText>
        Create Ad
      </ListItemText>
    </ListItem>
  :
    null
}

*/
