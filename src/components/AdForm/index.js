import React, { Component } from 'react'
import './index.css'
import PropTypes from 'prop-types'

class AdForm extends Component {
  static propTypes = {
    catId: PropTypes.number,
  }

  static contextTypes = {
    web3: PropTypes.object,
    contract: PropTypes.object,
    account: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      catId: props.catId,
      catName: '',
      text: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const { web3, contract, account } = this.context
    const { catName, text } = this.state
console.dir({
  from: account,
  gasPrice: web3.utils.toWei('1', 'gwei'),
  gas: 10**6,
  value: 0,
})
    contract.methods.newCatWithAd(catName, text).send({
      from: account,
      gasPrice: web3.utils.toWei('1', 'gwei'),
      gas: 10**6,
      value: 0,
    }).on('receipt', receipt => {
        console.log('receipt')
        console.dir(receipt)
      }).on('confirmation', function(confirmationNumber, receipt){
        if (confirmationNumber === 5)
          console.dir(receipt)
      }).on('error', (err, receit) => {
        console.log('err = ', err)
        console.log('error receit')
        console.dir(receit)
      })
  }

  render() {
    //let {category, user} = this.props

    //console.dir(this.context.contract)

    return (
      <section className="AdForm">
        <form onSubmit={this.handleSubmit}>
          <input name="id" value="{this.state.id}" type="hidden"/>
          <input name="catId" value="{this.state.catId}" type="hidden"/>

          <input type="text"
            name="catName"
            onChange={this.handleChange}
            value={this.state.catName}
          />

          <br/>

          <textarea
            name="text"
            cols="30" rows="10"
            onChange={this.handleChange}
            value={this.state.text}
          />

          <br/>

          <button>Submit</button>

        </form>
      </section>
    )
  }
}

export default AdForm
