// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { IS_PROD } from '../constants';

function setupGlobals () {
  // Globals for preload script
  global.IS_PROD = IS_PROD;
}

export default setupGlobals;
