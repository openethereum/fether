// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader, Clickable, MenuPopup } from 'fether-ui';
import { Link, withRouter } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
class Tokens extends PureComponent {
  handleGoToLink = url => {
    this.props.history.push(url);
  };

  isParitySignerAccount = () => {
    const {
      account: { type }
    } = this.props;

    return type === 'signer';
  };

  menuItems = () => {
    const {
      account: { address }
    } = this.props;

    const backupAccountItem = {
      name: 'Backup Account',
      url: `/backup/${address}`
    };

    let menuItems = [
      {
        name: 'Add tokens',
        url: `/whitelist/${address}`
      }
    ];

    if (this.isParitySignerAccount() === false) {
      menuItems = [backupAccountItem, ...menuItems];
    }

    return menuItems;
  };

  render () {
    const {
      account: { address, name, type }
    } = this.props;

    return (
      <div className='tokens'>
        <AccountHeader
          address={address}
          copyAddress
          name={name}
          type={type}
          left={
            <Link to='/accounts' className='icon -back'>
              Back
            </Link>
          }
          right={
            <MenuPopup
              className='popup-menu-account'
              horizontalOffset={1}
              menuItems={this.menuItems()}
              onItemClick={this.handleGoToLink}
              size='small'
              trigger={<Clickable className='icon -menu' />}
            />
          }
        />

        <TokensList />

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
        </nav>
      </div>
    );
  }
}

export default Tokens;
