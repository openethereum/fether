// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { accountsInfo$, defaultAccount$ } from '@parity/light.js';
import Blockie from 'react-blockies';
import light from 'light-hoc';
import { Link } from 'react-router-dom';

@light({
  accountsInfo: accountsInfo$,
  defaultAccount: defaultAccount$
})
class Receive extends PureComponent {
  render () {
    const { accountsInfo, defaultAccount } = this.props;

    if (!defaultAccount) return <div>Loading...</div>;

    return (
      <div>
        <nav className='header-nav'>
          <div className='header-nav_left'>
            <Link to='/tokens' className='icon -close'>
              Close
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>
              {accountsInfo && defaultAccount && accountsInfo[defaultAccount]
                ? accountsInfo[defaultAccount].name
                : 'Loading...'}
            </h1>
          </div>
          <div className='header-nav_right' />
        </nav>
        <div className='window_content'>
          <div className='box -padded'>
            <div className='box -card'>
              <div className='account'>
                <div className='account_avatar'>
                  <Blockie seed={defaultAccount} />
                </div>
                <div className='account_information'>
                  <div className='account_name'>
                    {accountsInfo &&
                    defaultAccount &&
                    accountsInfo[defaultAccount]
                      ? accountsInfo[defaultAccount].name
                      : 'Loading...'}
                  </div>
                  <div className='account_address'>{defaultAccount}</div>
                </div>
              </div>
              <div className='box -card-drawer'>
                <div className='text'>
                  <p>Your address is:</p>
                </div>
                <div className='text -code'>{defaultAccount}</div>
                <div className='box text -right'>
                  <button className='button -utility'>
                    Copy address to clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Receive;
