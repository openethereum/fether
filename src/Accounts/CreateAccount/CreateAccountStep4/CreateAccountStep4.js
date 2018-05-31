// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import Blockie from 'react-blockies';
import { inject, observer } from 'mobx-react';

@inject('createAccountStore')
@observer
class CreateAccountStep4 extends Component {
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
    const { createAccountStore, history } = this.props;
    const { hint, password } = this.state;
    createAccountStore.setPassword(password);
    createAccountStore.setHint(hint);
    history.push('/accounts/new/step5');
  };

  render () {
    const { createAccountStore: { address, name } } = this.props;
    const { confirm, hint, password } = this.state;

    return (
      <div className='window_content'>
        <div className='box -padded'>
          <div className='box -card'>
            <div className='account'>
              <div className='account_avatar'>
                <Blockie seed={address} />
              </div>
              <div className='account_information'>
                <div className='account_name'>
                  {name || <span className='span -placeholder'>Account</span>}
                </div>
                <div className='account_address'>
                  {address}
                </div>
              </div>
            </div>
            <div className='box -card-drawer'>
              <form onSubmit={this.handleSubmit}>
                <div className='text'>
                  <p>Secure your account with a password:</p>
                </div>

                <div className='form_field'>
                  <label>Password{' '}</label>
                  <input
                    onChange={this.handlePasswordChange}
                    required
                    type='password'
                    value={password}
                  />
                </div>

                <div className='form_field'>
                  <label>Confirm{' '}</label>
                  <input
                    onChange={this.handleConfirmChange}
                    required
                    type='password'
                    value={confirm}
                  />
                </div>

                <div className='form_field'>
                  <label>Password Hint (optional) {' '}</label>
                  <input
                    onChange={this.handleHintChange}
                    type='text'
                    value={hint}
                  />
                </div>

                <nav className='form-nav'>
                  {password && confirm === password
                    ? <button className='button'>Next</button>
                    : <button className='button' disabled='true'>Next</button>}
                </nav>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccountStep4;
