// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader, Clickable, MenuPopup } from 'fether-ui';
import { Link, withRouter } from 'react-router-dom';

import i18n from '../i18n';
import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
class Tokens extends PureComponent {
  state = {
    isMenuOpen: false
  };

  handleMenuClose = () => {
    this.setState({ isMenuOpen: false });
  };

  handleMenuOpen = () => {
    this.setState({ isMenuOpen: true });
  };

  isParitySignerAccount = () => {
    const {
      account: { type }
    } = this.props;

    return type === 'signer';
  };

  menuItems = () => {
    const {
      account: { address },
      history
    } = this.props;

    const backupAccountItem = {
      name: i18n.t('ns1:tokens.tokens.menu_items.backup_account'),
      onClick: () => history.push(`/backup/${address}`)
    };

    const menuItems = [
      {
        name: i18n.t('ns1:tokens.tokens.menu_items.add_tokens'),
        onClick: () => history.push(`/whitelist/${address}`)
      }
    ];

    if (this.isParitySignerAccount() === false) {
      menuItems.unshift(backupAccountItem);
    }

    return menuItems;
  };

  render () {
    const {
      account: { address, name, type }
    } = this.props;
    const { isMenuOpen } = this.state;

    return (
      <React.Fragment>
        <div className='tokens'>
          <div className={isMenuOpen ? 'popup-underlay' : ''} />
          <AccountHeader
            address={address}
            copyAddress
            i18n={i18n}
            name={name}
            type={type}
            left={
              <Link to='/accounts' className='icon -back'>
                {i18n.t('ns1:navigation.back')}
              </Link>
            }
            right={
              <MenuPopup
                className='popup-menu-account'
                horizontalOffset={1}
                menuItems={this.menuItems()}
                onClose={this.handleMenuClose}
                onOpen={this.handleMenuOpen}
                size='small'
                trigger={<Clickable className='icon -menu' />}
              />
            }
          />

          <TokensList />
        </div>
        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Tokens;
