// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

class Send extends Component {
  render () {
    return (
      <div>
        <div className='token box -card'>
          <div className='token_icon'>
            <img src='/ethereum.png' />
          </div>
          <div className='token_name'>Ethereum</div>
          <div className='token_balance'>42.89</div>
        </div>

        <div>
          <form>
            <div>
              <input type='tel' placeholder='address' />
              <input type='tel' placeholder='amount' />
              <input type='tel' placeholder='gas' />
            </div>
            <button className='button'>Send</button>
          </form>
        </div>
      </div>

    );
  }
}

export default Send;
