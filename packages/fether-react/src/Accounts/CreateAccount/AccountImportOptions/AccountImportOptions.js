// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { addressShort, Card, Form as FetherForm } from 'fether-ui';
import { inject, observer } from 'mobx-react';

import Scanner from '../../../Scanner';
import withAccountsInfo from '../../../utils/withAccountsInfo';

@withAccountsInfo
@inject('createAccountStore')
@observer
class AccountImportOptions extends Component {
  state = {
    error: '',
    isLoading: false,
    phrase: '',
    importingFromSigner: false
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

      if (this.hasExistingAddressForImport(createAccountStore.address)) {
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
      createAccountStore,
      createAccountStore: { setJsonString }
    } = this.props;

    this.setState({ isLoading: true });

    try {
      await setJsonString(jsonString);

      if (this.hasExistingAddressForImport(createAccountStore.address)) {
        return;
      }

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

  handleSignerImported = async ({ address, chainId: chainIdString }) => {
    const {
      createAccountStore: { importFromSigner }
    } = this.props;

    if (!address || !chainIdString) {
      this.setState({ error: 'Invalid QR code.' });
      return;
    }

    const chainId = parseInt(chainIdString);

    if (this.hasExistingAddressForImport(address, chainId)) {
      return;
    }

    await importFromSigner({ address, chainId });

    this.handleNextStep();
  };

  handleSignerImport = () => {
    this.setState({
      importingFromSigner: true
    });
  };

  hasExistingAddressForImport = (addressForImport, chainId) => {
    const { accountsInfo } = this.props;
    const isExistingAddress = Object.keys(accountsInfo).some(
      key =>
        key.toLowerCase() === addressForImport.toLowerCase() &&
        (!accountsInfo[key].chainId ||
          !chainId ||
          accountsInfo[key].chainId === chainId)
    );

    if (isExistingAddress) {
      this.setState({
        isLoading: false,
        error: `Account ${addressShort(addressForImport)} already listed`
      });
    }

    return isExistingAddress;
  };

  render () {
    const {
      history,
      location: { pathname }
    } = this.props;
    const { error, importingFromSigner, phrase } = this.state;
    const currentStep = pathname.slice(-1);

    const jsonCard = (
      <Card>
        <div key='createAccount'>
          <div className='text -centered'>
            <p>Recover from JSON Keyfile</p>

            <FetherForm.InputFile
              label='JSON Backup Keyfile'
              onChangeFile={this.handleChangeFile}
              required
            />
          </div>
        </div>
      </Card>
    );

    const signerCard = (
      <Card>
        <div key='createAccount'>
          <div className='text -centered'>
            <p>Recover from Parity Signer</p>

            {importingFromSigner ? (
              <Scanner
                onScan={this.handleSignerImported}
                label='Please show the QR code of the account on the webcam.'
              />
            ) : (
              <button
                className='button -footer'
                onClick={this.handleSignerImport}
              >
                Scan QR code
              </button>
            )}
          </div>
        </div>
      </Card>
    );

    const phraseCard = (
      <Card>
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
      </Card>
    );

    return (
      <div className='center-md'>
        {!importingFromSigner && jsonCard}
        <br />
        {signerCard}
        <br />
        {!importingFromSigner && phraseCard}
        <br />
        <p>{error}</p>
        <nav className='form-nav -space-around'>
          {currentStep > 1 && (
            <button className='button -back' onClick={history.goBack}>
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
