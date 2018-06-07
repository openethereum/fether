// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import CreateAccountHeader from '../CreateAccountHeader';

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
    const { createAccountStore, history, location: { pathname } } = this.props;
    const { hint, password } = this.state;
    createAccountStore.setPassword(password);
    createAccountStore.setHint(hint);

    const currentStep = pathname.slice(-1);
    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  render () {
    const { confirm, hint, password } = this.state;

    return (
      <div className='box -padded'>
        <div className='box -card'>
          <CreateAccountHeader />
          <div className='box -card-drawer'>
            <form onSubmit={this.handleSubmit}>
              <div className='text'>
                <p>Secure your account with a password:</p>
              </div>

              <div className='form_field'>
                <label>Password </label>
                <input
                  onChange={this.handlePasswordChange}
                  required
                  type='password'
                  value={password}
                />
              </div>

              <div className='form_field'>
                <label>Confirm </label>
                <input
                  onChange={this.handleConfirmChange}
                  required
                  type='password'
                  value={confirm}
                />
              </div>

              <div className='form_field'>
                <label>Password Hint (optional) </label>
                <input
                  onChange={this.handleHintChange}
                  type='text'
                  value={hint}
                />
              </div>

              <nav className='form-nav'>
                {password && confirm === password
                  ? <button className='button'>Next</button>
                  : <button className='button' disabled>
                      Next
                  </button>}
              </nav>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountPassword;
