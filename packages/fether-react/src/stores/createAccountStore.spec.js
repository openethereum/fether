// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import { CreateAccountStore } from './createAccountStore';
import parityStore from './parityStore';
import * as storeTests from '../utils/testHelpers/storeTests';

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

describe('method clear', () => {
  test('should call setAddress and setName', () => {
    createAccountStore.setAddress = jest.fn();
    createAccountStore.setName = jest.fn();
    createAccountStore.clear();
    expect(createAccountStore.setAddress).toHaveBeenCalledWith(null);
    expect(createAccountStore.setName).toHaveBeenCalledWith('');
  });
});

describe('method generateNewAccount', () => {
  test('should call api.parity.generateSecretPhrase', () => {
    createAccountStore.generateNewAccount();
    expect(parityStore.api.parity.generateSecretPhrase).toHaveBeenCalledWith();
  });
});

describe('method saveAccountToParity', () => {
  beforeAll(() => {
    createAccountStore.setPhrase('foo');
    createAccountStore.saveAccountToParity('bar');
  });

  test('should call api.parity.newAccountFromPhrase', () => {
    expect(parityStore.api.parity.newAccountFromPhrase).toHaveBeenCalledWith(
      'foo',
      'bar'
    );
  });

  test('should call api.parity.setAccountName', () => {
    expect(parityStore.api.parity.setAccountName).toHaveBeenCalled();
  });

  test('should call api.parity.setAccountMeta', () => {
    expect(parityStore.api.parity.setAccountMeta).toHaveBeenCalled();
  });
});

storeTests.setterTest(CreateAccountStore, 'address');
storeTests.setterTest(CreateAccountStore, 'isImport');
storeTests.setterTest(CreateAccountStore, 'name');

describe('setter phrase', () => {
  test('should set correct value and call api.parity.phraseToAddress', () => {
    createAccountStore.setPhrase('foo');
    expect(parityStore.api.parity.phraseToAddress).toHaveBeenCalledWith('foo');
    expect(createAccountStore.phrase).toEqual('foo');
  });
});
