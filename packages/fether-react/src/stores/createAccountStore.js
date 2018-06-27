// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from 'mobx';

import parityStore from './parityStore';

class CreateAccountStore {
  @observable address = null;
  @observable isImport = false; // Are we creating a new account, or importing via phrase?
  @observable name = ''; // Account name
  @observable phrase = null; // The 12-word seed phrase

  /**
   * Reinitialize everything
   */
  clear () {
    this.setAddress(null);
    this.setName('');
  }

  generateNewAccount = () => {
    return parityStore.api.parity.generateSecretPhrase().then(this.setPhrase);
  };

  saveAccountToParity = password => {
    return parityStore.api.parity
      .newAccountFromPhrase(this.phrase, password)
      .then(() =>
        parityStore.api.parity.setAccountName(this.address, this.name)
      )
      .then(() =>
        parityStore.api.parity.setAccountMeta(this.address, {
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
  setPhrase = phrase => {
    this.phrase = phrase;
    return parityStore.api.parity
      .phraseToAddress(phrase)
      .then(address => this.setAddress(address));
  };
}

export default new CreateAccountStore();
