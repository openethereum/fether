// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Card, Form as FetherForm } from 'fether-ui';
import { accountsInfo$, withoutLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import { inject, observer } from 'mobx-react';

@light({
  accountsInfo: () => accountsInfo$().pipe(withoutLoading())
})
@inject('createAccountStore')
@observer
class AccountImportOptions extends Component {
  state = {
    error: '',
    isLoading: false,
    phrase: ''
  };

  handleNextStep = async () => {
    const {
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);
    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  handlePhraseChange = ({ target: { value: phrase } }) => {
    this.setState({ phrase });
  };

  handleSubmitPhrase = async () => {
    const phrase = this.state.phrase.trim();
    const {
      createAccountStore,
      createAccountStore: { setPhrase }
    } = this.props;

    this.setState({ isLoading: true, phrase });

    try {
      await setPhrase(phrase);

      const addressForPhrase = createAccountStore.address.toLowerCase();

      if (this.hasExistingAddressForImport(addressForPhrase)) {
        return;
      }

      this.handleNextStep();
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          'The passphrase was not recognized. Please verify that you entered your passphrase correctly.'
      });
      console.error(error);
    }
  };

  handleChangeFile = async jsonString => {
    const {
      createAccountStore: { setJsonString }
    } = this.props;

    this.setState({ isLoading: true });

    try {
      const jsonAddress = `0x${JSON.parse(jsonString)[
        'address'
      ].toLowerCase()}`;

      if (this.hasExistingAddressForImport(jsonAddress)) {
        return;
      }

      await setJsonString(jsonString);
      this.handleNextStep();
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          'Invalid file. Please check this is your actual Parity backup JSON keyfile and try again.'
      });
      console.error(error);
    }
  };

  hasExistingAddressForImport = addressForImport => {
    const { accountsInfo } = this.props;
    const isExistingAddress = Object.keys(accountsInfo)
      .map(address => address && address.toLowerCase())
      .includes(addressForImport);

    if (isExistingAddress) {
      this.setState({
        isLoading: false,
        error: `Account already loaded. Address ${addressForImport} is already in the account list`
      });
    }

    return isExistingAddress;
  };

  render () {
    const {
      history,
      location: { pathname }
    } = this.props;
    const { error, phrase } = this.state;
    const currentStep = pathname.slice(-1);

    const jsonCard = (
      <div key='createAccount'>
        <div className='text -centered'>
          <p> Recover from JSON Keyfile </p>

          <FetherForm.InputFile
            label='JSON Backup Keyfile'
            onChangeFile={this.handleChangeFile}
            required
          />
        </div>
      </div>
    );

    const phraseCard = (
      <div key='importBackup'>
        <div className='text -centered'>
          <p>Recover from Seed Phrase</p>

          <FetherForm.Field
            as='textarea'
            label='Recovery phrase'
            onChange={this.handlePhraseChange}
            required
            phrase={phrase}
          />

          {this.renderButton()}
        </div>
      </div>
    );

    return (
      <div className='center-md'>
        <Card> {jsonCard} </Card>
        <br />
        <Card> {phraseCard} </Card>
        <br />
        <p>{error}</p>
        <nav className='form-nav -space-around'>
          {currentStep > 1 && (
            <button className='button -cancel' onClick={history.goBack}>
              Back
            </button>
          )}
        </nav>
      </div>
    );
  }

  renderButton = () => {
    const { isLoading, json, phrase } = this.state;

    // If we are importing an existing account, the button goes to the next step
    return (
      <button
        className='button'
        disabled={(!json && !phrase) || isLoading}
        onClick={this.handleSubmitPhrase}
      >
        Next
      </button>
    );
  };
}

export default AccountImportOptions;
