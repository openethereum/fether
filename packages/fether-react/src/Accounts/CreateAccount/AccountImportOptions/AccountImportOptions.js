// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { addressShort, Card, Form as FetherForm } from 'fether-ui';
import { inject, observer } from 'mobx-react';

import RequireHealthOverlay from '../../../RequireHealthOverlay';
import Scanner from '../../../Scanner';
import withAccountsInfo from '../../../utils/withAccountsInfo';
import i18n, { packageNS } from '../../../i18n';

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
        error: i18n.t(
          `${packageNS}:account.import.phrase.error_msg_submit_phrase`
        )
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
        error: i18n.t(`${packageNS}:account.import.error_msg_change_json_file`)
      });
      console.error(error);
    }
  };

  handleSignerImported = async ({ address, chainId: chainIdString }) => {
    const {
      createAccountStore: { importFromSigner }
    } = this.props;

    if (!address || !chainIdString) {
      this.setState({
        error: i18n.t(
          `${packageNS}:account.import.signer.error_msg_signer_imported`
        )
      });
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
        error: i18n.t(
          `${packageNS}:account.import.error_msg_existing_address`,
          {
            address: addressShort(addressForImport)
          }
        )
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
            <p>
              {i18n.t(
                `${packageNS}:account.import.json.label_msg_recover_json`
              )}
            </p>

            <FetherForm.InputFile
              i18n={i18n}
              label={i18n.t(
                `${packageNS}:account.import.json.label_recover_json`
              )}
              onChangeFile={this.handleChangeFile}
              packageNS={packageNS}
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
            <p>
              {i18n.t(
                `${packageNS}:account.import.signer.label_msg_recover_signer`
              )}
            </p>

            {importingFromSigner ? (
              <Scanner
                onScan={this.handleSignerImported}
                label={i18n.t(
                  `${packageNS}:account.import.signer.label_msg_recover_signer_scan`
                )}
              />
            ) : (
              <button
                className='button -footer'
                onClick={this.handleSignerImport}
              >
                {i18n.t(
                  `${packageNS}:account.import.signer.label_button_recover_signer_scan`
                )}
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
            <p>
              {i18n.t(
                `${packageNS}:account.import.phrase.label_msg_recover_phrase`
              )}
            </p>
            <FetherForm.Field
              as='textarea'
              label={i18n.t(
                `${packageNS}:account.import.phrase.label_recover_phrase`
              )}
              onChange={this.handlePhraseChange}
              required
              phrase={phrase}
            />

            {this.renderButton()}
          </div>
        </div>
      </Card>
    );

    const spacer = <div style={{ height: '0.5rem' }} />;

    return (
      <RequireHealthOverlay require='node'>
        <div className='center-md'>
          {!importingFromSigner && jsonCard}
          {spacer}
          {signerCard}
          {spacer}
          {!importingFromSigner && phraseCard}
          <p className='error-import-account'>{error}</p>
          {currentStep > 1 && (
            <nav className='form-nav -space-around'>
              <button className='button -back' onClick={history.goBack}>
                {i18n.t(`${packageNS}:navigation.back`)}
              </button>
            </nav>
          )}
        </div>
      </RequireHealthOverlay>
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
        {i18n.t(`${packageNS}:navigation.next`)}
      </button>
    );
  };
}

export default AccountImportOptions;
