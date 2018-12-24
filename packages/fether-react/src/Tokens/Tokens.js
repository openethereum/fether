// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader } from 'fether-ui';
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
  constructor (props) {
    super(props);

    this.menuRef = React.createRef();
    this.menuCloseOverlayRef = React.createRef();
  }

  componentDidMount () {
    const menuCloseOverlayRef = this.menuCloseOverlayRef.current;

    menuCloseOverlayRef.addEventListener('mouseup', this.handleCloseMenu);
  }

  componentWillUnmount () {
    const menuCloseOverlayRef = this.menuCloseOverlayRef.current;

    menuCloseOverlayRef.addEventListener('mouseup', this.handleCloseMenu);
  }

  handleGoToBackup = () => {
    this.props.history.push(`/backup/${this.props.accountAddress}`);
  };

  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.accountAddress}`);
  };

  handleOpenMenu = () => {
    const menuRef = this.menuRef.current;
    const menuCloseOverlayRef = this.menuCloseOverlayRef.current;

    menuRef.style.display = 'block';
    menuCloseOverlayRef.style.display = 'block';
  };

  handleCloseMenu = () => {
    const menuRef = this.menuRef.current;
    const menuCloseOverlayRef = this.menuCloseOverlayRef.current;

    menuRef.style.display = 'none';
    menuCloseOverlayRef.style.display = 'none';
  };

  render () {
    const { accountsInfo, accountAddress } = this.props;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to='/accounts/new' />;
    }

    return (
      <div className='wrapper'>
        <div className='menu-close' ref={this.menuCloseOverlayRef} />
        <div className='menu' ref={this.menuRef}>
          <div className='menu-item' onClick={this.handleGoToBackup}>
            Backup Account
          </div>
          <div className='menu-item' onClick={this.handleGoToWhitelist}>
            Add Tokens
          </div>
        </div>
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
            <a className='icon -more' onClick={this.handleOpenMenu}>
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
