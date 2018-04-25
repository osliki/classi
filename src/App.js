import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import PropTypes from 'prop-types';
import Web3 from 'web3';

class App extends Component {
  static propTypes = {
    contractAddress: PropTypes.string.isRequired,
    contractAbi: PropTypes.array.isRequired,
  }

  static contextTypes = {
    web3: PropTypes.object
  }

  static childContextTypes = {
    contract: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      contract: {}/*,
      web3: new Web3(window.web3.currentProvider)*/
    }
  }

  componentDidMount () {
    //const { web3 } = window;

    let  web3 = new Web3(window.web3.currentProvider)

    this.setState({
      contract: new web3.eth.Contract(this.props.contractAbi, this.props.contractAddress)
    }, () => {

      /*.then((err)=>{
        console.dir('err')
        console.dir(err)
      })
      .catch((err)=>{
        console.dir('err')
        console.dir(err)
      })*/;
    })



  };
//this.state.contract.setUpPrice(Web3.utils.toWei('0.5', 'ether')).send({from: this.context.web3.accounts[0]});
  getChildContext() {
    return {
      contract: this.state.contract
    };
  }

  async onClick() {
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
        <Board />
      </div>
    );
  }
}

export default App;
