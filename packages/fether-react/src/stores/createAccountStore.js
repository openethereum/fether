// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from 'mobx';

import bip39 from 'bip39';
import hdkey from 'ethereumjs-wallet/hdkey';

import LS_PREFIX from './utils/lsPrefix';
import localForage from 'localforage';

import Debug from '../utils/debug';
import parityStore from './parityStore';
import getParityWordlist from './utils/getParityWordlist';

const debug = Debug('createAccountStore');

export const SIGNER_ACCOUNTS_LS_KEY = `${LS_PREFIX}::paritySignerAccounts`;
const DERIVATION_PATH = "m/44'/60'/0'/0/0";

export class CreateAccountStore {
  @observable
  isImport = false; // Are we creating a new account, or importing via phrase?

  @observable
  jsonString = null;

  @observable
  parityPhrase = null; // 12-word seed phrase

  @observable
  bip39Phrase = null; // 12- to 24-word seed phrase

  @observable
  address = null;

  @observable
  name = ''; // Account name

  signerChainId = null;

  @action
  setIsImport = isImport => {
    this.isImport = isImport;
  };

  /**
   * Reinitialize everything
   */
  @action
  clear = async () => {
    this.jsonString = null;
    this.parityPhrase = null;
    this.bip39Phrase = null;
    this.address = null;
    this.name = '';
  };

  /**
   * Generate a BIP39 seed phrase and derive the address from it
   */
  generateNewAccount = async () => {
    debug('Generating new account.');

    const mnemonic = bip39.generateMnemonic();
    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    const wallet = hdwallet.derivePath(DERIVATION_PATH).getWallet();
    const address = `0x${wallet.getAddress().toString('hex')}`;

    this.bip39Phrase = mnemonic;
    this.address = address;
  };

  saveAccountToParity = async password => {
    debug('Saving account to Parity.');

    if (this.noPrivateKey()) {
      // Store new Signer account in local storage
      // If the address of the account to add doesn't already exist, add it
      const accounts =
        (await localForage.getItem(SIGNER_ACCOUNTS_LS_KEY)) || [];
      if (
        !accounts.some(
          ({ address: existingAddress }) =>
            existingAddress.toLowerCase() === this.address.toLowerCase()
        )
      ) {
        accounts.push({ address: this.address, name: this.name, chainId: this.signerChainId });
      }
      await localForage.setItem(SIGNER_ACCOUNTS_LS_KEY, accounts);
    } else {
      // Otherwise, store the new account in the node
      if (this.jsonString) {
        await parityStore.api.parity.newAccountFromWallet(
          this.jsonString,
          password
        );
      } else if (this.parityPhrase) {
        await parityStore.api.parity.newAccountFromPhrase(
          this.parityPhrase,
          password
        );
      } else if (this.bip39Phrase) {
        await parityStore.api.parity.newAccountFromSecret(
          '0x' +
            hdkey
              .fromMasterSeed(bip39.mnemonicToSeed(this.bip39Phrase))
              .derivePath(DERIVATION_PATH)
              .getWallet()
              .getPrivateKey()
              .toString('hex'),
          password
        );
      } else {
        throw new Error(
          'saveAccountToParity: no JSON, Parity phrase, BIP39 phrase or address'
        );
      }

      await parityStore.api.parity.setAccountName(this.address, this.name);
      await parityStore.api.parity.setAccountMeta(this.address, {
        timestamp: Date.now()
      });
    }
  };

  /**
   * Set phrase (detect type) and corresponding address
   */

  setPhrase = phrase => {
    return this.setBip39Phrase(phrase).catch(() =>
      this.setParityPhrase(phrase)
    );
  };

  setBip39Phrase = async phrase => {
    this.clear();

    if (!bip39.validateMnemonic(phrase)) throw new Error('Not a BIP39 phrase');

    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(phrase));
    const wallet = hdwallet.derivePath(DERIVATION_PATH).getWallet();

    this.bip39Phrase = phrase;
    this.address = `0x${wallet.getAddress().toString('hex')}`;
  };

  setParityPhrase = async phrase => {
    this.clear();

    const words = phrase.split(' ');
    const PARITY_WORDLIST = getParityWordlist();
    if (
      words.length < 12 ||
      words.length > 24 ||
      !words.every(word => PARITY_WORDLIST.has(word))
    ) {
      throw new Error('Not a Parity phrase');
    }

    return parityStore.api.parity.phraseToAddress(phrase).then(
      action(address => {
        this.parityPhrase = phrase;
        this.address = address;
      })
    );
  };

  /**
   * Recover from a JSON keyfile
   */

  @action
  setJsonString = async jsonString => {
    this.clear();

    const json = JSON.parse(jsonString);

    if (!json || json.address.length !== 40 || json.version !== 3) {
      throw new Error('File is not valid json');
    }

    this.jsonString = jsonString;
    this.address = `0x${json.address}`;
    if (json.name) {
      this.setName(json.name);
    }
  };

  @action
  setName = async name => {
    this.name = name;
  };

  @action
  importFromSigner = async ({address, chainId}) => {
    await this.clear();
    this.address = address;
    this.signerChainId = chainId;
  };

  // Returns true for Signer account imports
  // @computed get
  noPrivateKey = () =>
    !this.jsonString && !this.parityPhrase && !this.bip39Phrase;
}

export default new CreateAccountStore();
