// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader, MenuPopup } from 'fether-ui';
import { Link, withRouter } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
class Tokens extends PureComponent {
  state = {
    isMenuOpen: false
  };

  handleToggleMenu = () => {
    const { isMenuOpen } = this.state;

    this.setState({ isMenuOpen: !isMenuOpen });
  };

  handleMenuRef = menuNode => this.setState({ menuNode });

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
    const { isMenuOpen, menuNode } = this.state;

    return (
      <div className='tokens'>
        <div className={isMenuOpen ? 'popup-underlay' : ''} />
        <MenuPopup
          className='popup-menu-account'
          context={menuNode}
          handleGoToLink={this.handleGoToLink}
          horizontalOffset={1}
          menuItems={this.menuItems()}
          onClose={this.handleToggleMenu}
          open={isMenuOpen}
          size='small'
        />
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
            <a
              className='icon -menu'
              ref={this.handleMenuRef}
              onClick={this.handleToggleMenu}
            >
              Menu
            </a>
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
