// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, observable } from 'mobx';

import parityStore from './parityStore';

class CreateAccountStore {
  @observable address = null;
  @observable hint = ''; // Password hint (optional)
  @observable name = ''; // Account name
  @observable password = '';
  @observable phrase = null; // The 12-word seed phrase

  constructor() {
    this.api = parityStore.api;
  }

  generateNewAccount = () => {
    return this.api.parity
      .generateSecretPhrase()
      .then(phrase => {
        this.setPhrase(phrase);
        return this.api.parity.phraseToAddress(phrase);
      })
      .then(address => this.setAddress(address));
  };

  saveAccountToParity = () => {
    return this.api.parity
      .newAccountFromPhrase(this.phrase, this.password)
      .then(address => this.api.parity.setAccountName(this.address, this.name))
      .then(() =>
        this.api.parity.setAccountMeta(this.address, {
          timestamp: Date.now(),
          passwordHint: this.hint
        })
      );
  };

  @action
  setAddress = address => {
    this.address = address;
  };

  @action
  setHint = hint => {
    this.hint = hint;
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
  };
}

export default new CreateAccountStore();
