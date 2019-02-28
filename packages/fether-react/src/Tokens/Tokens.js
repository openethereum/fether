// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import localForage from 'localforage';
import React, { PureComponent } from 'react';
import { AccountHeader, Clickable, MenuPopup } from 'fether-ui';
import { Link, withRouter } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
class Tokens extends PureComponent {
  state = {
    canViewRecoveryPhrase: false,
    isMenuOpen: false,
    showWarning: false,
    flaggedPhrase: null
  };

  componentDidMount () {
    this.checkAccount();
  }

  /*
    Check if user account is flagged for skipping
    phrase rewrite step. Show warning if flagged.
    If account was created before #400, the
    Backup Recovery Phrase menu item will not be
    visible.
  */
  checkAccount = async () => {
    const {
      account: { address }
    } = this.props;

    const flaggedPhrase = await localForage.getItem(`__flagged_${address}`);
    const canViewRecoveryPhrase =
      (await localForage.getItem(`__safe_${address}`)) ||
      (flaggedPhrase && true);

    this.setState({
      canViewRecoveryPhrase,
      flaggedPhrase,
      showWarning: flaggedPhrase && true
    });
  };

  handleMenuClose = () => {
    this.setState({ isMenuOpen: false });
  };

  handleMenuOpen = () => {
    this.setState({ isMenuOpen: true });
  };

  handlePhraseRewrite = async () => {
    const {
      account: { address },
      history
    } = this.props;

    // Redirect to rewrite screen.
    history.push(`/rewrite/${address}`);
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
    const { canViewRecoveryPhrase, showWarning } = this.state;

    const backupAccountItem = {
      name: 'Backup Account',
      onClick: () => history.push(`/backup/${address}`)
    };

    const backupPhraseItem = {
      name: `${
        showWarning ? 'Backup Recovery Phrase' : 'View Recovery Phrase'
      }`,
      onClick: () => history.push(`/backupPhrase/${address}/${showWarning}`),
      warn: showWarning
    };

    const menuItems = [
      {
        name: 'Add Tokens',
        onClick: () => history.push(`/whitelist/${address}`)
      }
    ];

    if (!this.isParitySignerAccount()) {
      if (canViewRecoveryPhrase) {
        menuItems.push(backupPhraseItem);
      }
      menuItems.push(backupAccountItem);
    }

    return menuItems;
  };

  menuTrigger = () => {
    const { showWarning } = this.state;

    return (
      <span style={{ display: 'flex' }}>
        <Clickable className='icon -menu' />
        {showWarning && <span className='icon -warning' />}
      </span>
    );
  };

  render () {
    const {
      account: { address, name, type }
    } = this.props;
    const { isMenuOpen } = this.state;

    const rightMenu = (
      <div>
        <MenuPopup
          className='popup-menu-account'
          horizontalOffset={1}
          menuItems={this.menuItems()}
          onClose={this.handleMenuClose}
          onOpen={this.handleMenuOpen}
          size='small'
          trigger={this.menuTrigger()}
        />
      </div>
    );

    return (
      <div className='tokens'>
        <div className={isMenuOpen ? 'popup-underlay' : ''} />
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
          right={rightMenu}
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
