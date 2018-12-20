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
  isCancelled = false;

  state = {
    showMenu: false
  };

  constructor (props) {
    super(props);

    this.menuRef = React.createRef();
  }

  componentDidMount () {
    document.addEventListener('mouseup', this.handleMenuBlur);
  }

  componentWillUnmount () {
    // Avoids encountering error `Can't call setState (or forceUpdate)
    // on an unmounted component` when navigate
    this.isCancelled = true;

    document.removeEventListener('mouseup', this.handleMenuBlur);
  }

  handleGoToBackup = () => {
    this.props.history.push(`/backup/${this.props.accountAddress}`);
  };

  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.accountAddress}`);
  };

  handleMenuBlur = event => {
    const { showMenu } = this.state;
    const menuDiv = this.menuRef.current;

    if (menuDiv && !menuDiv.contains(event.target)) {
      menuDiv.style.display = 'none';
      !this.isCancelled && this.setState({ showMenu: !showMenu });
    }
  };

  handleToggleMenu = () => {
    const { showMenu } = this.state;

    !this.isCancelled && this.setState({ showMenu: !showMenu });
  };

  render () {
    const { accountsInfo, accountAddress } = this.props;
    const { showMenu } = this.state;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to='/accounts/new' />;
    }

    return (
      <div className='wrapper'>
        {showMenu ? (
          <div className='menu' ref={this.menuRef}>
            <div className='menu-item'>
              <button className='button -tiny' onClick={this.handleGoToBackup}>
                Backup Account
              </button>
            </div>
            <div className='menu-item'>
              <button
                className='button -tiny'
                onClick={this.handleGoToWhitelist}
              >
                Add tokens
              </button>
            </div>
          </div>
        ) : null}
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
            <a className='icon -more' onClick={this.handleToggleMenu}>
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
