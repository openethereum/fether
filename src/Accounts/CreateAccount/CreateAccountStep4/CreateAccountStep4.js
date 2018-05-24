// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';

@inject('createAccountStore')
@observer
class CreateAccountStep3 extends PureComponent {
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
    const { confirm, hint, password } = this.state;

    return (
      <div>
        <h3>Create account step 4</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Password:{' '}
            <input
              onChange={this.handlePasswordChange}
              required
              type='password'
              value={password}
            />
          </label>
          <br />
          <label>
            Confirm:{' '}
            <input
              onChange={this.handleConfirmChange}
              required
              type='password'
              value={confirm}
            />
          </label>
          <br />
          <label>
            Password Hint (optional):{' '}
            <input onChange={this.handleHintChange} value={hint} />
          </label>
          {password && confirm === password && <button>Submit</button>}
        </form>
      </div>
    );
  }
}

export default CreateAccountStep3;
