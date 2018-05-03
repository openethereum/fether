// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { defaultAccount$ } from '@parity/light.js';

import light from '../hoc';

@light({
  me: defaultAccount$
})
class Receive extends Component {
  render () {
    const { me } = this.props;
    return (
      <div>
        <div className='box -card'>
          <div className='box -padded'>
            <label>Wallet address</label>
          </div>
          <div className='box -padded address'>
            <code>{me}</code>
          </div>
          <div className='box -padded'>
            <button className='-small'>Copy to clipboard</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Receive;
