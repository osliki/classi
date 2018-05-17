import React from 'react'

import Downshift from 'downshift'
import matchSorter from 'match-sorter'

import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'

const CatsAutocomplete = ({
  items,
  onChange,
  defaultSelectedItem,
  inputRef,
  inputValue,
  onInputChange = () => {},
  catsLoading = false,
  label = 'Category',
  helperText = ''
}) => {
  return (
    <Downshift
      onChange={onChange}
      itemToString={item => {
        return (item == null ? inputValue : String(item.name)) // or else after blur empty
      }}
      defaultInputValue={inputValue}
      defaultSelectedItem={defaultSelectedItem}
      defaultHighlightedIndex={0}
      inputValue={inputValue}
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
            label={label}
            margin="normal"
            fullWidth
            inputRef={inputRef}
            required
            inputProps={{maxLength: 100}}
            disabled={catsLoading}
            helperText={catsLoading ? 'Loading categories...' : helperText}
            {...getInputProps({
              onChange: (e) => onInputChange(e, clearSelection, selectItem),
            })}
          />

          {isOpen ? (
            <Paper className="downshift-paper" square>
              {matchSorter(items, inputValue, {
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
                    {item.loading ? 'loading...' : `(${item.adsCount}) ${item.name}`}
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
