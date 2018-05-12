// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import ethereumIcon from '../assets/img/tokens/ethereum.png';

class Send extends Component {
  render () {
    return (
      <div className='box -well'>
        <div className='box -card'>
          <header className='token -header'>
            <div className='token_icon'>
              <img src={ethereumIcon} alt='ethereum' />
            </div>
            <div className='token_name'>Ethereum</div>
            <div className='token_balance'>
              42.89
              <span className='token_symbol'>ETH</span>
            </div>
          </header>

          <form className='send-form'>
            <ul className='send-form_fields'>
              <li>
                <label>Address</label>
                <input type='tel' />
              </li>
              <li>
                <label>Amount</label>
                <input type='tel' />
              </li>
              <li>
                <label>Gas</label>
                <input type='tel' />
              </li>
            </ul>
            <div className='send-form_action'>
              <button className='button'>Send</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Send;
