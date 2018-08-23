// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Header } from 'fether-ui';
import { accountsInfo$ } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from '@parity/light.js-react';

import Health from '../../Health';

@light({
  accountsInfo: accountsInfo$
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
            <ul className='list'>
              {accountsInfo ? (
                Object.keys(accountsInfo).map(address => (
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
                ))
              ) : (
                <li>
                  <AccountCard />
                </li>
              )}
            </ul>
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
