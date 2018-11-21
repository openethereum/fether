// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountHeader, Form as FetherForm } from 'fether-ui';
import { accountsInfo$ } from '@parity/light.js';
import light from '@parity/light.js-react';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';

import { inject, observer } from 'mobx-react';

@withRouter
@withAccount
@light({
  accountsInfo: accountsInfo$
})
@inject('createAccountStore')
@observer
class Tokens extends Component {
  state = {
    password: '',
    toggleBackupScreen: false,
    error: ''
  };

  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.accountAddress}`);
  };

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleSubmit = event => {
    const { accountAddress, createAccountStore, history } = this.props;
    const { password } = this.state;

    event.preventDefault();

    const _this = this;
    // api.parity.exportAccount
    createAccountStore.backupAccount(accountAddress, password).then(res => {
      if (res && res.type === 'ACCOUNT_ERROR') {
        _this.toggleError(
          res.text + ' Please check your password and try again.'
        );
      } else {
        createAccountStore.clear();
        history.push(`/accounts`);
      }
    });
  };

  toggleBackupScreen = () => {
    const { toggleBackupScreen } = this.state;
    this.setState({ toggleBackupScreen: !toggleBackupScreen });
  };

  toggleError = err => {
    this.setState({
      error: err
    });
  };

  renderPasswordFormField = password => {
    const { error } = this.state;

    return (
      <div>
        <div className='text -centered'>
          <button className='button' onClick={this.toggleBackupScreen}>
            close
          </button>
          <p>Unlock your account:</p>
        </div>
        <fieldset className='form_fields -centered'>
          <form key='createAccount' onSubmit={this.handleSubmit}>
            <FetherForm.Field
              label='Password'
              onChange={this.handlePasswordChange}
              required
              type='password'
              value={password}
            />

            <p className='error'> {error} </p>

            <button className='button -right' disabled={!password}>
              Confirm Backup
            </button>
          </form>
        </fieldset>
      </div>
    );
  };

  render () {
    const { password, toggleBackupScreen } = this.state;
    const { accountsInfo, accountAddress } = this.props;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to='/accounts/new' />;
    }

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

        <div className='center-md'>
          {toggleBackupScreen ? (
            this.renderPasswordFormField(password)
          ) : (
            <button className='button' onClick={this.toggleBackupScreen}>
              backup account
            </button>
          )}
        </div>

        <TokensList />

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
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
