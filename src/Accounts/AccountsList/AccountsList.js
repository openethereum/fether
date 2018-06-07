// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { accountsInfo$ } from '@parity/light.js';
import Blockies from 'react-blockies';
import { inject, observer } from 'mobx-react';

import Health from '../../Health';
import light from '../../hoc';

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
    const {
      history,
      parityStore: { api }
    } = this.props;
    // Set default account to the clicked one, and go to Tokens on complete
    this.subscription = api.parity
      .setNewDappsDefaultAddress(address)
      .then(() => history.push('/tokens'));
  };

  handleCreateAccount = () => {
    this.props.createAccountStore.setIsImporting(false);
    this.props.history.push('/accounts/new');
  };

  render () {
    const { accountsInfo } = this.props;

    return (
      <div>
        <nav className='header-nav'>
          <div className='header-nav_left' />
          <div className='header-nav_title'>
            <h1>Accounts</h1>
          </div>
          <div className='header-nav_right'>
            <a className='icon -new' onClick={this.handleCreateAccount}>
              New account
            </a>
          </div>
        </nav>

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
                    <div className='account box -card -clickable'>
                      <div className='account_avatar'>
                        <Blockies seed={address} />
                      </div>
                      <div className='account_information'>
                        <div className='account_name'>
                          {accountsInfo[address].name}
                        </div>
                        <div className='account_address'>{address}</div>
                      </div>
                    </div>
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
