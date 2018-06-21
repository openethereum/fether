// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, observable } from 'mobx';

import parityStore from './parityStore';

class CreateAccountStore {
  @observable address = null;
  @observable isImport = false; // Are we creating a new account, or importing via phrase?
  @observable name = ''; // Account name
  @observable password = '';
  @observable phrase = null; // The 12-word seed phrase

  constructor () {
    this.api = parityStore.api;
  }

  /**
   * Reinitialize everything
   */
  clear () {
    this.setAddress(null);
    this.setName('');
    this.setPassword('');
  }

  generateNewAccount = () => {
    return this.api.parity.generateSecretPhrase().then(this.setPhrase);
  };

  saveAccountToParity = () => {
    return this.api.parity
      .newAccountFromPhrase(this.phrase, this.password)
      .then(() => this.api.parity.setAccountName(this.address, this.name))
      .then(() =>
        this.api.parity.setAccountMeta(this.address, {
          timestamp: Date.now()
        })
      );
  };

  @action
  setAddress = address => {
    this.address = address;
  };

  @action
  setIsImport = isImport => {
    // First set address and phrase back to null
    this.address = null;
    this.phrase = null;

    this.isImport = isImport;
  };

  @action
  setName = name => {
    this.name = name;
  };

  @action
  setPassword = password => {
    this.password = password;
  };

  @action
  setPhrase = phrase => {
    this.phrase = phrase;
    return this.api.parity
      .phraseToAddress(phrase)
      .then(address => this.setAddress(address));
  };
}

export default new CreateAccountStore();
