// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { AccountHeader } from 'light-ui';
import { accountsInfo$, defaultAccount$ } from '@parity/light.js';
import light from 'light-hoc';
import { Link } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';

@light({
  accountsInfo: accountsInfo$,
  defaultAccount: defaultAccount$
})
class Tokens extends PureComponent {
  render () {
    const {
      accountsInfo,
      defaultAccount,
      location: { state }
    } = this.props;

    // The address is defaultAccount, but if we are coming from the accounts
    // page, then the address is also put inside the route state, for faster
    // access.
    const myAddress = (state && state.address) || defaultAccount;

    return (
      <div>
        <AccountHeader
          address={myAddress}
          copyAddress
          name={
            accountsInfo &&
            myAddress &&
            accountsInfo[myAddress] &&
            accountsInfo[myAddress].name
          }
          left={
            <Link to='/accounts' className='icon -back'>
              Back
            </Link>
          }
        />

        <TokensList />

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
