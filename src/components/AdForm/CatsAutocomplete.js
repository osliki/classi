import React, { Component } from 'react'

import Downshift from 'downshift'
import matchSorter, {rankings, caseRankings} from 'match-sorter'

import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'

const CatsAutocomplete = (props) => {

  return (
    <Downshift
      onChange={props.onChange}
      itemToString={(item) => (item == null || item.name == null ? '' : String(item.name))}
      defaultSelectedItem={props.defaultSelectedItem}
    >
      {({getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
        clearSelection,
        selectItem
      }) => (
        <div className="downshift-container">
          <TextField
            name="catName"
            label="Category"
            margin="normal"
            fullWidth
            inputRef={props.inputRef}
            required
            {...getInputProps({
              value: props.inputValue,
              onChange: (e) => props.onInputChange ? props.onInputChange(e, clearSelection, selectItem) : null
            })}
          />

          {isOpen ? (
            <Paper className="downshift-paper" square>
              {matchSorter(props.items, inputValue, {
                  keys: ['name']
                }).map((item, index) => (
                  <MenuItem
                    {...getItemProps({ item: item })}
                    key={item.id}
                    selected={highlightedIndex === index}
                    component="div"
                    style={{
                      backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                      fontWeight: selectedItem && (selectedItem.name === item.name) ? 'bold' : 'normal',
                    }}
                  >
                    {item.loading ? 'loading...' : `${item.name} (${item.adsCount})`}
                  </MenuItem>
                ))
              }
            </Paper>
          ) : null}
        </div>
      )}
    </Downshift>
  )
}

export default CatsAutocomplete

/*<Downshift onChange={selectedItem => console.log(selectedItem)}>
  {({getInputProps,
    getItemProps,
    isOpen,
    inputValue,
    selectedItem,
    highlightedIndex,
  }) => (
    <div className="downshift-container">
      <TextField
        name="catName"
        label="Category"
        value={catName}
        onChange={onChange}
        margin="normal"
        fullWidth
        inputRef={el => this.catNameInput = el}
        required
        {...getInputProps()}
      />

      {isOpen ? (
        <Paper className="downshift-paper" square>
          {matchSorter(suggestions, inputValue, {
              keys: ['name']
            }).map((item, index) => (
              <MenuItem
                {...getItemProps({ item: item.name })}
                key={item.name}
                selected={highlightedIndex === index}
                component="div"
                style={{
                  backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                  fontWeight: selectedItem === item.name ? 'bold' : 'normal',
                }}
              >
                {item.name}
              </MenuItem>
            ))
          }
        </Paper>
      ) : null}
    </div>
  )}
</Downshift>*/
