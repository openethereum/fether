// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Form as FetherForm } from 'fether-ui';
import { inject, observer } from 'mobx-react';

@inject('createAccountStore')
@observer
class AccountPassword extends Component {
  state = {
    confirm: '',
    isLoading: false,
    password: '',
    error: ''
  };

  handleConfirmChange = ({ target: { value } }) => {
    this.setState({ confirm: value });
  };

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleSubmit = event => {
    const { createAccountStore, history } = this.props;
    const { password } = this.state;

    event.preventDefault();
    this.setState({ isLoading: true });

    // Save to parity
    createAccountStore
      .saveAccountToParity(password)
      .then(res => {
        createAccountStore.clear();
        history.push('/accounts');
      })
      .catch(err => {
        console.error(err);

        this.setState({
          isLoading: false,
          error: err.text
        });
      });
  };

  render () {
    const {
      createAccountStore: { address, name, jsonString, isImport },
      history,
      location: { pathname }
    } = this.props;
    const { confirm, error, isLoading, password } = this.state;
    const currentStep = pathname.slice(-1);

    return (
      <AccountCard
        address={address}
        name={name}
        drawers={[
          <form key='createAccount' onSubmit={this.handleSubmit}>
            <div className='text'>
              <p>
                {' '}
                {jsonString
                  ? 'Unlock your account to decrypt your JSON keystore file: '
                  : 'Secure your account with a password:'}
              </p>
            </div>

            <FetherForm.Field
              label='Password'
              onChange={this.handlePasswordChange}
              required
              type='password'
              value={password}
            />

            {!jsonString && (
              <FetherForm.Field
                label='Confirm'
                onChange={this.handleConfirmChange}
                required
                type='password'
                value={confirm}
              />
            )}

            <p>
              {error && error + ' Please check your password and try again.'}
            </p>

            <nav className='form-nav -space-around'>
              {currentStep > 1 && (
                <button className='button -cancel' onClick={history.goBack}>
                  Back
                </button>
              )}
              <button
                className='button'
                disabled={
                  !password ||
                  (!jsonString && confirm !== password) ||
                  isLoading
                }
              >
                Confirm account {isImport ? `${'import'}` : `${'creation'}`}
              </button>
            </nav>
          </form>
        ]}
      />
    );
  }
}

export default AccountPassword;
