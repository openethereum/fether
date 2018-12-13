// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import bip39 from 'bip39';
import { CreateAccountStore } from './createAccountStore';
import parityStore from './parityStore';

jest.mock('./parityStore', () => ({
  api: {
    parity: {
      generateSecretPhrase: jest.fn(() => Promise.resolve('foo')),
      newAccountFromPhrase: jest.fn(() => Promise.resolve()),
      phraseToAddress: jest.fn(() => Promise.resolve('0x123')),
      setAccountName: jest.fn(() => Promise.resolve()),
      setAccountMeta: jest.fn(() => Promise.resolve())
    }
  }
}));

let createAccountStore; // Will hold the newly created instance of createAccountStore in each test
beforeEach(() => {
  createAccountStore = new CreateAccountStore();
});

describe('method generateNewAccount', () => {
  test('should generate a valid bip39 phrase and derive the address', async () => {
    await createAccountStore.generateNewAccount();

    expect(bip39.validateMnemonic(createAccountStore.bip39Phrase)).toBe(true);

    expect(createAccountStore.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });
});

describe('method clear', () => {
  test('should reset phrase, address and name', async () => {
    createAccountStore.jsonString = '{}';
    createAccountStore.parityPhrase = 'phrase';
    createAccountStore.bip39Phrase = 'phrase';
    createAccountStore.address = '0x123';
    createAccountStore.name = 'account name';
    await createAccountStore.clear();
    expect(createAccountStore.jsonString).toBe(null);
    expect(createAccountStore.parityPhrase).toBe(null);
    expect(createAccountStore.bip39Phrase).toBe(null);
    expect(createAccountStore.address).toBe(null);
    expect(createAccountStore.name).toBe('');
  });
});

describe('method setPhrase', () => {
  test('should set bip39 phrase', async () => {
    const bip39Phrase =
      'enforce gun ripple coast resemble travel pole crane caught connect muscle burst';
    await createAccountStore.setPhrase(bip39Phrase);
    expect(createAccountStore.bip39Phrase).toEqual(bip39Phrase);
    expect(createAccountStore.address.toLowerCase()).toEqual(
      '0xA40826D9E47DA552887868c894447f7377DCd019'.toLowerCase()
    );
  });

  test('should set Parity phrase', async () => {
    const parityPhrase =
      'onto blandness slobbery putt crazed repackage defender subzero bullpen virus skater blunderer';
    await createAccountStore.setPhrase(parityPhrase);
    expect(createAccountStore.parityPhrase).toEqual(parityPhrase);
    expect(parityStore.api.parity.phraseToAddress).toHaveBeenCalledWith(
      parityPhrase
    );
  });
});

describe('method setJsonString', () => {
  test('should set json string', async () => {
    const jsonString =
      '{"address":"00933a3529b53e499ab284c6a467864f390b91f9","crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"92499cec6b490f5538df9fa1623bc19b"},"ciphertext":"2759bfe3fafb990474a54e10888a7c1b53514c8fa8111972b5e21f704715328d","kdf":"pbkdf2","kdfparams":{"c":10240,"dklen":32,"prf":"hmac-sha256","salt":"4f3600fc86deb30d98525d3402ceca4186151ff1e473885a46e7885bc6fc24a7"},"mac":"0ccbb53bb97f222168b81c19d65173b43122edbb1a647982217710451a35e6fc"},"id":"2bd37594-9601-0574-7e24-d4ee73fbad15","meta":"{\\"timestamp\\":1540590385821}","name":"Kovan-Toaster","version":3}';
    await createAccountStore.setJsonString(jsonString);
    expect(createAccountStore.jsonString).toEqual(jsonString);
  });
});

describe('method saveAccountToParity', () => {
  beforeAll(async () => {
    await createAccountStore.setPhrase(
      'onto blandness slobbery putt crazed repackage defender subzero bullpen virus skater blunderer'
    );
    await createAccountStore.setName('name');
    await createAccountStore.saveAccountToParity('cryptopass');
  });

  test('should call api.parity.setAccountName', () => {
    expect(parityStore.api.parity.setAccountName).toHaveBeenCalled();
  });

  test('should call api.parity.setAccountMeta', () => {
    expect(parityStore.api.parity.setAccountMeta).toHaveBeenCalled();
  });
});
