// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import ParityStore from './ParityStore';
import TokensStore from './TokensStore';

export default {
  parityStore: new ParityStore(),
  tokensStore: new TokensStore()
};
