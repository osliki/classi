import React from 'react'

import './index.css'
import metamaskImg from'./metamask.png'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

const Requirements = (props) => {
  //const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  return (
    <section className="Requirements">
      <Typography variant="title">
        Welcome to Osliki Classifieds
      </Typography>

      <br/>

      <Typography color="textSecondary">
        Decentralized Classified Advertising Application powered by Ethereum and IPFS
      </Typography>

      <br/>

      <Card classes={{root: 'Requirements-card'}}>
        <CardContent>
          <Typography>
            In order to make requests to Ethereum Blockchain, this application requires MetaMask extension
          </Typography>

          <br/>
          <br/>

          <div className="">
            <a href={isFirefox ?
              'https://addons.mozilla.org/firefox/addon/ether-metamask/'
            :
              'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
            } target="_blank">
              <img src={metamaskImg} alt="metamask" />

              <br/>
              <br/>


              Get MetaMask for {isFirefox ? 'Firefox' : 'Chrome'}
            </a>

          </div>
        </CardContent>

      </Card>

    </section>

  )
}

export default Requirements
