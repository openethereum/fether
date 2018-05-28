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
          <div className='header-nav_left'>
            <Link to='/tokens' className='icon -close'>
              x
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>Address</h1>
          </div>
          <div className='header-nav_right'>
          </div>
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
