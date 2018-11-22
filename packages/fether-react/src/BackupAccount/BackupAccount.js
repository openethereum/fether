// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountHeader, Card, Form as FetherForm } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { accountsInfo$ } from '@parity/light.js';
import light from '@parity/light.js-react';
import { Link, withRouter } from 'react-router-dom';
import withAccount from '../utils/withAccount';

@withRouter
@withAccount
@light({
  accountsInfo: accountsInfo$
})
@inject('createAccountStore')
@observer
class BackupAccount extends Component {
  state = {
    confirm: '',
    isLoading: false,
    password: '',
    message: ''
  };

  toggleMsg = msg => {
    this.setState({
      message: msg
    });
  };

  handleConfirmChange = ({ target: { value } }) => {
    this.setState({ confirm: value });
  };

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleSubmit = event => {
    const { accountAddress, createAccountStore, history } = this.props;
    const { password } = this.state;

    event.preventDefault();
    this.setState({ isLoading: true });

    // Save to parity
    createAccountStore
      .backupAccount(accountAddress, password)
      .then(res => {
        if (res) {
          createAccountStore.clear();
          setTimeout(() => history.push(`/accounts`), 5000);
        }
      })
      .catch(err => {
        this.toggleMsg(err.text + ' Please check your password and try again.');
      });
  };

  render () {
    const {
      accountsInfo,
      history,
      location: { pathname }
    } = this.props;
    const { confirm, isLoading, message, password } = this.state;
    const accountAddress = pathname.slice(-42);

    return (
      <div>
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
        />
        <br />
        <Card className='-space-around'>
          <form key='backupAccount' onSubmit={this.handleSubmit}>
            <div className='text'>
              <p>Encrypt your backup with your password:</p>
            </div>

            <FetherForm.Field
              label='Password'
              onChange={this.handlePasswordChange}
              required
              type='password'
              value={password}
            />

            <FetherForm.Field
              label='Confirm'
              onChange={this.handleConfirmChange}
              required
              type='password'
              value={confirm}
            />

            <p className='error'> {message} </p>

            <nav className='form-nav -space-around'>
              <button className='button -cancel' onClick={history.goBack}>
                Back
              </button>
              <button
                className='button'
                disabled={!password || confirm !== password || isLoading}
              >
                Confirm backup
              </button>
            </nav>
          </form>
        </Card>
      </div>
    );
  }
}

export default BackupAccount;
