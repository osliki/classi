import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import Board from './components/Board';


class App extends Component {
  static propTypes = {
    contractAddress: PropTypes.string.isRequired,
    contractAbi: PropTypes.array.isRequired,
  }
/*
  static contextTypes = {
    web3: PropTypes.object
  }*/

  static childContextTypes = {
    web3: PropTypes.object,
    contract: PropTypes.object,
    account: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      web3: {},
      contract: {},
      account: '',
    }
  }

  componentWillMount() {
    const web3 = new Web3(window.web3.currentProvider);

    this.setState({
      web3: web3,
      contract: new web3.eth.Contract(this.props.contractAbi, this.props.contractAddress),
      account: window.web3.eth.defaultAccount,
    });
  }

//this.state.contract.setUpPrice(Web3.utils.toWei('0.5', 'ether')).send({from: this.context.web3.accounts[0]});
  getChildContext() {
    const { web3, contract, account } = this.state;

    return {
      web3,
      contract,
      account
    };
  }

  async onClick() {

    return
    const { web3 } = window

    console.log('thisstate............................contract')
    console.dir(this.state.contract)
    console.log( web3.eth.defaultAccount)
/*
    let res = await this.state.contract.methods.upPrice().call() //{from: web3.eth.defaultAccount}
    console.dir(res)*/

    const receipt = await this.state.contract.methods._setUpPrice(Web3.utils.toWei('99999', 'ether')).send({
      from: web3.eth.defaultAccount,
      gasPrice : Web3.utils.toWei('1', 'gwei'),
      gas: 35000,
      value: 0,
    })

    console.log('receipt')
    console.dir(receipt)

    const price = await this.state.contract.methods.upPrice().call()

    console.log('price = ', price)

    /*.on('receipt', receipt => {
      console.log('receipt')
      console.dir(receipt)
      this.state.contract.methods.upPrice().call()
        .then(price => console.log('price = ', price))
    }).on('error', (err, receit) => {
      console.log('err = ', err)
      console.log('error receit')
      console.dir(receit)
    })*/




    /*.then((res) => {
      console.log('then')
      console.dir(res)
    }).catch((error) => {
      console.log('error')
      console.dir(error)
    })
      .on('transactionHash', function(hash){
        console.log('transactionHash', hash)
      })

      .on('confirmation _setUpPrice', function(confirmationNumber, receipt){
        console.log('confirmation', confirmationNumber)
        console.dir(receipt)
      })*/

  }

  render() {



    return (
      <div className="App" onClick={this.onClick.bind(this)}>
        <Board context={this.state} />

      </div>
    );
  }
}

export default App;
