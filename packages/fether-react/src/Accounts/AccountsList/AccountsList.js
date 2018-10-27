// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Header } from 'fether-ui';
import { accountsInfo$, withoutLoading } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from '@parity/light.js-react';

import Health from '../../Health';

@light({
  accountsInfo: () => accountsInfo$().pipe(withoutLoading())
})
@inject('createAccountStore', 'parityStore')
@observer
class AccountsList extends Component {
  handleClick = ({
    currentTarget: {
      dataset: { address }
    }
  }) => {
    const { history } = this.props;

    history.push(`/tokens/${address}`);
  };

  handleCreateAccount = () => {
    this.props.createAccountStore.setIsImport(false);
    this.props.history.push('/accounts/new');
  };

  render () {
    const { accountsInfo } = this.props;

    const accountsList = Object.keys(accountsInfo);

    return (
      <div className='accounts-list'>
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
            {accountsList.length ? (
              <ul className='list'>
                {accountsList.map(address => (
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
                        (accountsInfo[address].name
                          ? accountsInfo[address].name
                          : '(No name)')
                      }
                      shortAddress
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className='create-hint'>
                Nothing here yet!
                <br />
                <br />
                Click the + icon to add a new account.
              </p>
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
