// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import createAccountStore from './createAccountStore';
import healthStore from './healthStore';
import onboardingStore from './onboardingStore';
import parityStore from './parityStore';
import sendStore from './sendStore';
import tokensStore from './tokensStore';

export default {
  createAccountStore,
  healthStore,
  onboardingStore,
  parityStore,
  sendStore,
  tokensStore
};
