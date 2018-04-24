import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/normalize.css/normalize.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Web3Provider } from 'react-web3';
import oslikiClassifieds from './contracts/OslikiClassifieds.json';
console.log(oslikiClassifieds.networks['4447'].address)
ReactDOM.render(

    <App
      contractAddress={oslikiClassifieds.networks['4447'].address}
      contractAbi={oslikiClassifieds.abi}
    />
  , document.getElementById('root')
);
registerServiceWorker();
