// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from 'mobx';

import Debug from '../utils/debug';
import parityStore from './parityStore';
import FileSaver from 'file-saver';

const debug = Debug('createAccountStore');

export class CreateAccountStore {
  @observable
  address = null;
  @observable
  json = {};
  @observable
  isImport = false; // Are we creating a new account, or importing via phrase?
  @observable
  isJSON = false; // Are we recovering an account from a JSON backup file/
  @observable
  name = ''; // Account name
  @observable
  phrase = null; // The 12-word seed phrase

  /**
   * Reinitialize everything
   */
  clear () {
    this.setPhrase(null);
    this.setName('');
  }

  backupAccount = (address, password) => {
    debug('Generating Backup JSON.');
    return parityStore.api.parity
      .exportAccount(address, password)
      .then(res => {
        const blob = new window.Blob([JSON.stringify(res)], {
          type: 'application/json; charset=utf-8'
        });

        FileSaver.saveAs(blob, `${res.address}.json`);

        return Promise.resolve('Successfully backed up account');
      })
      .catch(err => {
        console.error(err);
        return Promise.reject(err);
      });
  };

  generateNewAccount = () => {
    debug('Generating new account.');
    return this.setPhrase(null)
      .then(() => parityStore.api.parity.generateSecretPhrase())
      .then(this.setPhrase);
  };

  saveAccountToParity = async password => {
    debug('Saving account to Parity.');

    try {
      if (this.isJSON && this.json) {
        await parityStore.api.parity.newAccountFromWallet(
          JSON.stringify(this.json),
          password
        );
      } else if (this.phrase) {
        await parityStore.api.parity.newAccountFromPhrase(
          this.phrase,
          password
        );
      }

      await parityStore.api.parity.setAccountName(this.address, this.name);
      await parityStore.api.parity.setAccountMeta(this.address, {
        timestamp: Date.now()
      });
      return Promise.resolve(`Saved account ${this.address} to Parity`);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  @action
  setAddress = address => {
    this.address = address;
  };

  @action
  setJSON = json => {
    this.json = json;

    const prefix = '0x';
    const prefixedAddress = prefix.concat(json.address);

    this.setAddress(prefixedAddress || null);
    this.setName(json.name || null);
  };

  @action
  setIsImport = isImport => {
    this.isImport = isImport;
  };

  @action
  setIsJSON = isJSON => {
    this.isJSON = isJSON;
  };

  @action
  setName = name => {
    this.name = name;
  };

  /**
   * Set phrase and corresponding address
   */
  @action
  setPhrase = phrase => {
    this.phrase = phrase;
    this.address = null;

    if (!phrase) return Promise.resolve();
    else {
      return parityStore.api.parity
        .phraseToAddress(phrase)
        .then(address => this.setAddress(address));
    }
  };
}

export default new CreateAccountStore();
