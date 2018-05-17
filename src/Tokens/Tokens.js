// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect, Link } from 'react-router-dom';

import Health from '../Health';
import EthBalance from './EthBalance';
import TokenBalance from './TokenBalance';

@inject('parityStore', 'tokensStore')
@observer
class Tokens extends Component {
  render () {
    const {
      parityStore: { isApiConnected },
      tokensStore: { tokens }
    } = this.props;

    if (!isApiConnected) {
      return <Redirect to='/loading' />;
    }

    return (
      <div>
        <nav className='header-nav'>
          <Link to='/'>
            &larr;
          </Link>
          <Link to='/tokens'>
            {/* TODO: account name */}
            test
          </Link>
          <Link to='/receive' className='icon -receive'>
            Receive
          </Link>
        </nav>

        <div className='window_content'>
          <div className='box -scroller'>
            <ul className='list -padded'>
              {Array.from(tokens.keys()).map(key => (
                <li key={key}>
                  {key === 'ETH' ? (
                    <EthBalance token={key} {...tokens.get(key)} />
                  ) : (
                    <TokenBalance token={key} {...tokens.get(key)} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
            <Link to='/settings' className='icon -settings'>
              Settings
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Tokens;
