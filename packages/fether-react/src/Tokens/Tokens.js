// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader } from 'fether-ui';
import { Link, withRouter } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
class Tokens extends PureComponent {
  handleGoToBackup = () => {
    this.props.history.push(`/backup/${this.props.account.address}`);
  };

  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.account.address}`);
  };

  render () {
    const {
      account: { address, name, type }
    } = this.props;

    return (
      <div>
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
        />

        <TokensList />

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
            {// Hide option to do a backup if this is a Parity Signer account
              type === 'node' && (
                <button className='button -tiny' onClick={this.handleGoToBackup}>
                Backup Account
                </button>
              )}
            <button className='button -tiny' onClick={this.handleGoToWhitelist}>
              Add tokens
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

export default Tokens;
