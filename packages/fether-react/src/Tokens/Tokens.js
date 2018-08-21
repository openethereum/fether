// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader } from 'fether-ui';
import { accountsInfo$ } from '@parity/light.js';
import light from 'light-hoc';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

import Health from '../Health';
import Send from '../Send';
import TokensList from './TokensList';
import Whitelist from '../Whitelist';

import { provideTokens } from '../contexts/TokensContext.js';
import { provideAccount, consumeAccount } from '../contexts/AccountContext.js';

@provideAccount(
  ({
    match: {
      params: { accountAddress }
    }
  }) => accountAddress
)
@consumeAccount
@provideTokens
@light({
  accountsInfo: accountsInfo$
})
class Tokens extends PureComponent {
  handleGoToWhitelist = () => {
    this.props.history.push(`/tokens/${this.props.accountAddress}/whitelist`);
  };

  renderTokensList = () => {
    const { accountsInfo, accountAddress } = this.props;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to='/accounts/new' />;
    }

    return (
      <div>
        <AccountHeader
          address={accountAddress}
          copyAddress
          name={
            accountsInfo &&
            accountsInfo[accountAddress] &&
            accountsInfo[accountAddress].name
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
            <button className='button -tiny' onClick={this.handleGoToWhitelist}>
              Add tokens
            </button>
          </div>
        </nav>
      </div>
    );
  };

  render () {
    const {
      match: { url }
    } = this.props;

    return (
      <Switch>
        <Route path={`${url}/whitelist`}>
          <Whitelist />
        </Route>
        <Route path={`${url}/send`} component={Send} />
        <Route path={url}>{this.renderTokensList}</Route>
      </Switch>
    );
  }
}

export default Tokens;
