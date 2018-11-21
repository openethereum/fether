// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Card, Form as FetherForm } from 'fether-ui';

import { inject, observer } from 'mobx-react';

@inject('createAccountStore')
@observer
class AccountImportBackup extends Component {
  state = {
    isLoading: false,
    isFileValid: false,
    json: null
  };

  handleNextStep = async () => {
    const {
      history,
      location: { pathname },
      createAccountStore: { isJSON, setJSON }
    } = this.props;
    const currentStep = pathname.slice(-1);
    const { json } = this.state;

    if (isJSON) {
      this.setState({ isLoading: true });
      await setJSON(json);
    }

    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  toggleImportMethod = () => {
    const { createAccountStore } = this.props;
    createAccountStore.setIsJSON(!createAccountStore.isJSON);
  };

  handleChangeFile = ({ target: { result } }) => {
    try {
      const json = JSON.parse(result);

      const isFileValid =
        json.address.length === 32 &&
        typeof json.meta === 'object' &&
        json.crypto &&
        json.crypto.cipher === 'aes-128-ctr';

      this.setState({
        isFileValid,
        json
      });
    } catch (error) {
      this.setState({
        isFileValid: false,
        json: null
      });
      console.error(error);
    }
  };

  render () {
    const {
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);

    const body = [
      <div key='createAccount'>
        <div className='text -centered'>
          <p> Drop your JSON keyfile below </p>
          <button onClick={this.toggleImportMethod} className='button -tiny'>
            Use Seed Phrase
          </button>

          <FetherForm.InputFile
            label='JSON Backup Keyfile'
            onChangeFile={this.handleChangeFile}
            required
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
      </div>
    ];

    return <Card>{body}</Card>;
  }

  renderButton = () => {
    const { isFileValid, isLoading, json } = this.state;

    // If we are importing an existing account, the button goes to the next step
    return (
      <button
        className='button'
        disabled={!json || !isFileValid || isLoading}
        onClick={this.handleNextStep}
      >
        Next
      </button>
    );
  };
}

export default AccountImportBackup;
