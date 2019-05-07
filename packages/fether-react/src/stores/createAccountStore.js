// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, computed, observable } from 'mobx';

import bip39 from 'bip39';
import hdkey from 'ethereumjs-wallet/hdkey';

import localForage from 'localforage';
import LS_PREFIX from './utils/lsPrefix';

import Debug from '../utils/debug';
import parityStore from './parityStore';
import getParityWordlist from './utils/getParityWordlist';

const debug = Debug('createAccountStore');

const DERIVATION_PATH = "m/44'/60'/0'/0/0";
const ETHEREUM_ADDRESS_LENGTH = 40;
const JSON_VERSION = 3;
const MIN_PARITY_SIGNER_RECOVERY_WORDS = 11;
const MAX_PARITY_SIGNER_RECOVERY_WORDS = 24;
export const SIGNER_ACCOUNTS_LS_KEY = `${LS_PREFIX}::paritySignerAccounts`;

export class CreateAccountStore {
  @observable
  address = null;

  @observable
  bip39Phrase = null; // 12 to 24-word seed phrase

  @observable
  isImport = false; // Are we creating a new account, or importing via phrase?

  @observable
  jsonString = null;

  @observable
  name = ''; // Account name

  @observable
  parityPhrase = null; // 11 or 12-word seed phrase (Parity Signer is used to generate an 11-word recovery phrase)

  @observable
  signerChainId = null;

  @action
  setIsImport = isImport => {
    this.isImport = isImport;
  };

  /**
   * Reinitialize account information
   */
  @action
  clear = () => {
    this.address = null;
    this.bip39Phrase = null;
    this.jsonString = null;
    this.name = '';
    this.parityPhrase = null;
    this.signerChainId = null;
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

    if (this.noPrivateKey) {
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
        accounts.push({
          address: this.address,
          name: this.name,
          chainId: this.signerChainId
        });
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

    this.address = `0x${wallet.getAddress().toString('hex')}`;
    this.bip39Phrase = phrase;
  };

  setParityPhrase = async phrase => {
    this.clear();

    const words = phrase.split(' ');
    const PARITY_WORDLIST = getParityWordlist();

    if (
      words.length < MIN_PARITY_SIGNER_RECOVERY_WORDS ||
      words.length > MAX_PARITY_SIGNER_RECOVERY_WORDS ||
      !words.every(word => PARITY_WORDLIST.has(word))
    ) {
      throw new Error('Not a Parity phrase');
    }

    return parityStore.api.parity.phraseToAddress(phrase).then(
      action(address => {
        this.address = address;
        this.parityPhrase = phrase;
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

    if (
      !json ||
      json.address.length !== ETHEREUM_ADDRESS_LENGTH ||
      json.version !== JSON_VERSION
    ) {
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
  importFromSigner = async ({ address, signerChainId }) => {
    this.clear();

    this.address = address;
    this.signerChainId = signerChainId;
  };

  // Returns true for Signer account imports
  @computed
  get noPrivateKey () {
    return !this.jsonString && !this.parityPhrase && !this.bip39Phrase;
  }
}

export default new CreateAccountStore();
