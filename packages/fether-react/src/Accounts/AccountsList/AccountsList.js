// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Clickable, Header } from 'fether-ui';
import { chainId$, withoutLoading } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from '@parity/light.js-react';

import i18n from '../../i18n';
import RequireHealthOverlay from '../../RequireHealthOverlay';
import Health from '../../Health';
import withAccountsInfo from '../../utils/withAccountsInfo';
// import withTranslation from '../../utils/withTranslation';

import Feedback from './Feedback';

i18n.changeLanguage('de-DE');
console.log('i18n.language: ', i18n.language);

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

    // i18n.changeLanguage('en-US');
    // console.log('i18n.language: ', i18n.language);

    const accountsList = Object.keys(accountsInfo).filter(
      key =>
        !accountsInfo[key].chainId ||
        accountsInfo[key].chainId === parseInt(chainId, 10)
    );
    const accountsListLength = accountsList && accountsList.length;

    return (
      <RequireHealthOverlay require='node'>
        <div className='accounts-list'>
          <Header
            right={
              <Clickable
                className='icon -new'
                onClick={this.handleCreateAccount}
              />
            }
            title={<h1>{i18n.t('ns1:accounts_list.header')}</h1>}
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
                        name={accountsInfo[address].name || i18n.t('(no name)')}
                        screen='accounts'
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
                  {i18n.t('ns1:accounts_list.hint')}
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
        </div>
      </RequireHealthOverlay>
    );
  }
}

export default AccountsList;
