// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { defaultAccount$ } from '@parity/light.js';
import { Link } from 'react-router-dom';

import light from '../hoc';

@light({
  me: defaultAccount$
})
class Receive extends Component {
  render () {
    const { me } = this.props;
    return (
      <div>
        <nav className='header-nav'>
          <Link to='/tokens' className='icon -close'>
            x
          </Link>
          <Link to='/'>
            Accounts
          </Link>
        </nav>
        <div className='window_content'>
          <div className='box -scroller -well'>
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
        </div>
      </div>
    );
  }
}

export default Receive;
