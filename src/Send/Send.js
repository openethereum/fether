// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

class Send extends Component {
  render () {
    return (
      <div>
        <div className='box -card'>
          <header className='token-header'>
            <div className='token-header_icon'>
              <img src='/ethereum.png' />
            </div>
            <div className='token-header_name'>Ethereum</div>
            <div className='token-header_balance'>42.89</div>
          </header>

          <form>
            <ul className='fields'>
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
            <button className='button'>Send</button>
          </form>
        </div>
      </div>

    );
  }
}

export default Send;
