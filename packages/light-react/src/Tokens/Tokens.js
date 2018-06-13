// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { accountsInfo$, defaultAccount$ } from '@parity/light.js';
import Blockies from 'react-blockies';
import { Header } from 'light-ui';
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
    const { accountsInfo, defaultAccount } = this.props;

    return (
      <div>
        <Header
          left={
            <Link to='/accounts' className='icon -back'>
              Back
            </Link>
          }
          title={
            accountsInfo &&
            defaultAccount &&
            accountsInfo[defaultAccount] && (
              <Link to='/receive'>
                <Blockies
                  seed={defaultAccount.toLowerCase()}
                  scale={2}
                  size={8}
                />{' '}
                {accountsInfo[defaultAccount].name}
              </Link>
            )
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
