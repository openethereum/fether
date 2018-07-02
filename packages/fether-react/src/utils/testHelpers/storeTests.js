// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import capitalize from 'capitalize';

let store;

export const setterTest = (Store, variableName) =>
  describe(`setter ${variableName}`, () => {
    beforeEach(() => {
      store = new Store();
    });

    test(`should correctly set ${variableName}`, () => {
      store[`set${capitalize(variableName)}`]('foo');
      expect(store[variableName]).toEqual('foo');
    });
  });
