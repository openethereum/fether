// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader, Modal } from 'fether-ui';
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

    this.state = {
      isModalOpen: false
    };
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleGoToBackup = () => {
    this.props.history.push(`/backup/${this.props.accountAddress}`);
  };

  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.accountAddress}`);
  };

  render () {
    const { accountsInfo, accountAddress } = this.props;
    const { isModalOpen } = this.state;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to='/accounts/new' />;
    }

    return (
      <div>
        <Modal open={isModalOpen} onClose={this.handleCloseModal}>
          <div className='modal-item' onClick={this.handleGoToBackup}>
            Backup Account
          </div>
          <div className='modal-item' onClick={this.handleGoToWhitelist}>
            Add Tokens
          </div>
        </Modal>
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
            <a className='icon -more' onClick={this.handleOpenModal}>
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
