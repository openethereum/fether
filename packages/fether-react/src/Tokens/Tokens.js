// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader, MenuPopup } from 'fether-ui';
import { accountsInfo$ } from '@parity/light.js';
import light from '@parity/light.js-react';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
@light({
  accountsInfo: accountsInfo$
})
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

  menuItems = () => {
    const { accountAddress } = this.props;

    return [
      {
        name: 'Backup Account',
        url: `/backup/${accountAddress}`
      },
      {
        name: 'Add tokens',
        url: `/whitelist/${accountAddress}`
      }
    ];
  };

  render () {
    const { accountsInfo, accountAddress } = this.props;
    const { isMenuOpen, menuNode } = this.state;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to='/accounts/new' />;
    }

    return (
      <div>
        <MenuPopup
          className='popup-menu-account'
          context={menuNode}
          handleGoToLink={this.handleGoToLink}
          horizontalOffset={1}
          hoverable
          menuItems={this.menuItems()}
          onClose={this.handleToggleMenu}
          open={isMenuOpen}
          size='small'
        />
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
          right={
            <a
              className='icon -new'
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
