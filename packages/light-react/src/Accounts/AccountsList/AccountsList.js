// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { AccountCard, Header } from 'light-ui';
import { accountsInfo$, defaultAccount$ } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from 'light-hoc';

import Health from '../../Health';

@light({
  accountsInfo: accountsInfo$,
  defaultAccount: defaultAccount$
})
@inject('createAccountStore', 'parityStore')
@observer
class AccountsList extends Component {
  handleClick = ({
    currentTarget: {
      dataset: { address }
    }
  }) => {
    const {
      defaultAccount,
      history,
      parityStore: { api }
    } = this.props;

    // If we selected the same account, just go back to the tokens page
    if (address === defaultAccount) {
      history.push('/tokens');
      return;
    }

    // We set the defaultAccount temporarily to null. The next
    // `setNewDappsDefaultAddress` will change it back to the correct default
    // account. The reason we do this is to show a loading state for
    // defaultAccount.
    defaultAccount$().next(null);

    // Set default account to the clicked one, and go to Tokens on complete
    // TODO Not 100% clean, I don't want any api.abc.method() in any React
    // component.
    api.parity
      .setNewDappsDefaultAddress(address)
      .then(() => {
        history.push('/tokens', { address });
      })
      .catch(err =>
        console.error(`Error while selecting account, ${err.message}.`)
      );
  };

  handleCreateAccount = () => {
    this.props.createAccountStore.setIsImport(false);
    this.props.history.push('/accounts/new');
  };

  render () {
    const { accountsInfo } = this.props;

    return (
      <div>
        <Header
          title={<h1>Accounts</h1>}
          right={
            <a className='icon -new' onClick={this.handleCreateAccount}>
              New account
            </a>
          }
        />

        <div className='window_content'>
          <div className='box -scroller'>
            {accountsInfo ? (
              <ul className='list'>
                {Object.keys(accountsInfo).map(address => (
                  <li
                    key={address}
                    data-address={address} // Using data- to avoid creating a new item Component
                    onClick={this.handleClick}
                  >
                    <AccountCard
                      address={address}
                      className='-clickable'
                      name={
                        accountsInfo &&
                        accountsInfo[address] &&
                        accountsInfo[address].name
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className='loader'>
                <p>Loading&hellip;</p>
              </div>
            )}
          </div>
        </div>

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
        </nav>
      </div>
    );
  }
}

export default AccountsList;
