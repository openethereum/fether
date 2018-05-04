// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import ElectronStore from './ElectronStore';
import TokensStore from './TokensStore';

export default {
  electronStore: new ElectronStore(),
  tokensStore: new TokensStore()
};
