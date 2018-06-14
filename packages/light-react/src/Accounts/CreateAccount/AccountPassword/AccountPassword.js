// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { FormField } from 'light-ui';
import { inject, observer } from 'mobx-react';

import CreateAccountContainer from '../CreateAccountContainer';

@inject('createAccountStore')
@observer
class AccountPassword extends Component {
  state = {
    confirm: '',
    hint: '',
    password: ''
  };

  handleConfirmChange = ({ target: { value } }) => {
    this.setState({ confirm: value });
  };

  handleHintChange = ({ target: { value } }) => {
    this.setState({ hint: value });
  };

  handlePasswordChange = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleSubmit = () => {
    const {
      createAccountStore,
      history,
      location: { pathname }
    } = this.props;
    const { hint, password } = this.state;
    createAccountStore.setPassword(password);
    createAccountStore.setHint(hint);

    const currentStep = pathname.slice(-1);
    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  render () {
    const { confirm, hint, password } = this.state;

    return (
      <CreateAccountContainer>
        <form onSubmit={this.handleSubmit}>
          <div className='text'>
            <p>Secure your account with a password:</p>
          </div>

          <FormField
            label='Password'
            onChange={this.handlePasswordChange}
            required
            type='password'
            value={password}
          />

          <FormField
            label='Conform'
            onChange={this.handleConfirmChange}
            required
            type='password'
            value={confirm}
          />

          <FormField
            label='Password Hint (optional)'
            onChange={this.handleHintChange}
            type='text'
            value={hint}
          />

          <nav className='form-nav'>
            <button
              className='button'
              disabled={!password || confirm !== password}
            >
              Next
            </button>
          </nav>
        </form>
      </CreateAccountContainer>
    );
  }
}

export default AccountPassword;
