// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { AccountCard, Card, Form as FetherForm } from 'fether-ui';
import { inject, observer } from 'mobx-react';

import AccountImportOptions from '../AccountImportOptions';

@inject('createAccountStore')
@observer
class AccountRewritePhrase extends Component {
  state = {
    isLoading: false,
    value: ''
  };

  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  handleNextStep = async () => {
    const {
      history,
      location: { pathname },
      createAccountStore: { isImport, setPhrase }
    } = this.props;
    const currentStep = pathname.slice(-1);
    const { value } = this.state;

    // If we're importing, derive address from recovery phrase when we submit
    if (isImport) {
      this.setState({ isLoading: true });
      await setPhrase(value);
    }

    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  render () {
    const {
      createAccountStore: { address, isImport, name },
      history,
      location: { pathname }
    } = this.props;
    const { value } = this.state;
    const currentStep = pathname.slice(-1);
    const body = [
      <div key='createAccount'>
        <div className='text -centered'>
          {isImport ? (
            <AccountImportOptions />
          ) : (
            <p>
              Type your secret phrase to confirm that you wrote it down
              correctly:
            </p>
          )}
        </div>

        <FetherForm.Field
          as='textarea'
          label='Recovery phrase'
          autoFocus
          onSubmit={this.handleNextStep}
          onChange={this.handleChange}
          required
          value={value}
        />

        <nav className='form-nav -space-around'>
          {currentStep > 1 && (
            <button className='button -cancel' onClick={history.goBack}>
              Back
            </button>
          )}
          {this.renderButton()}
        </nav>
      </div>
    ];

    return isImport ? (
      <Card>{body}</Card>
    ) : (
      <AccountCard
        address={address}
        name={address && !name ? '(no name)' : name}
        drawers={[body]}
      />
    );
  }

  renderButton = () => {
    const {
      createAccountStore: { isImport, bip39Phrase }
    } = this.props;
    const { isLoading, value } = this.state;

    // If we are creating a new account, the button just checks the phrase has
    // been correctly written by the user.
    if (!isImport) {
      return (
        <button
          className='button'
          disabled={value !== bip39Phrase}
          onClick={this.handleNextStep}
        >
          Next
        </button>
      );
    }

    // If we are importing an existing account, the button goes to the next step
    return (
      <button
        className='button'
        disabled={!value.length || isLoading}
        onClick={this.handleNextStep}
      >
        Next
      </button>
    );
  };
}

export default AccountRewritePhrase;
