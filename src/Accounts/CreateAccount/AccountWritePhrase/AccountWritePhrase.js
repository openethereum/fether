// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import CreateAccountHeader from '../CreateAccountHeader';

@inject('createAccountStore')
@observer
class AccountWritePhrase extends Component {
  state = {
    value: ''
  };

  handleChange = ({ target: { value } }) => this.setState({ value });

  handleNextStep = () => {
    const { history, location: { pathname } } = this.props;
    const currentStep = pathname.slice(-1);
    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  handleSavePhrase = () => {
    const { createAccountStore: { setPhrase } } = this.props;
    const { value } = this.state;
    setPhrase(value).then(this.handleNextStep);
  };

  render () {
    const { createAccountStore: { isImport } } = this.props;
    const { value } = this.state;

    return (
      <div className='window_content'>
        <div className='box -padded'>
          <div className='box -card'>
            {isImport ? <div>blank space</div> : <CreateAccountHeader />}
            <div className='box -card-drawer'>
              <div className='text'>
                <p>Please write your recovery phrase here:</p>
              </div>
              <div className='form_field'>
                <label>Recovery phrase</label>
                <input onChange={this.handleChange} required value={value} />
              </div>

              <nav className='form-nav'>
                {this.renderButton()}
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderButton = () => {
    const { createAccountStore: { isImport, phrase } } = this.props;
    const { value } = this.state;

    // If we are creating a new account, the button just checks the phrase has
    // been correctly written by the user.
    if (!isImport) {
      return (
        <button
          className='button'
          disabled={value !== phrase}
          onClick={this.handleNextStep}
        >
          Next
        </button>
      );
    }

    // If we are importing an existing account, the button sets the phrase
    return (
      <button className='button' onClick={this.handleSavePhrase}>
        Next
      </button>
    );
  };
}

export default AccountWritePhrase;
