// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Clickable, Header } from 'fether-ui';
import { chainId$, withoutLoading } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from '@parity/light.js-react';

import { DivWindowContent } from '../../assets/theme/shared/styledComponents/DivWindowContent.styles';
import Health from '../../Health';
import Feedback from './Feedback';
import withAccountsInfo from '../../utils/withAccountsInfo';

@withAccountsInfo
@inject('createAccountStore', 'parityStore')
@light({
  chainId: () => chainId$().pipe(withoutLoading())
})
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
    const { accountsInfo, chainId } = this.props;

    const accountsList = Object.keys(accountsInfo).filter(
      key =>
        !accountsInfo[key].chainId ||
        accountsInfo[key].chainId === parseInt(chainId, 10)
    );
    const accountsListLength = accountsList && accountsList.length;

    return (
      <DivWindowContent>
        <Header
          title={<h1>Accounts</h1>}
          right={
            <Clickable
              className='icon -new'
              onClick={this.handleCreateAccount}
            />
          }
        />

        <div className='window_content'>
          <div className='box -scroller'>
            {accountsListLength ? (
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
                      type={accountsInfo[address].type}
                      name={accountsInfo[address].name || '(no name)'}
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
          <div className='footer-feedback'>
            <Feedback accountsListLength={accountsListLength} />
          </div>
        </nav>
      </DivWindowContent>
    );
  }
}

export default AccountsList;
