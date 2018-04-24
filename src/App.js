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
    const { web3 } = window;

    this.setState({
      contract: web3.eth.contract(this.props.contractAbi).at(this.props.contractAddress)
    }, () => {
      console.log('this.state.contract')
      console.dir(this.state.contract)
      //, {from: web3.eth.accounts[0]}
      console.log( web3.eth.defaultAccount)
            this.state.contract.addAd('cat2', 'text', {from: web3.eth.defaultAccount})
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

  render() {



    return (
      <div className="App">
        <Board />
      </div>
    );
  }
}

export default App;
