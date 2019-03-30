// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { DEFAULT_WS_PORT, TRUSTED_LOOPBACK } from '../constants';
import cli from '../cli';

function setupGlobals () {
  // Globals for fether-react parityStore
  global.defaultWsInterface = TRUSTED_LOOPBACK;
  global.defaultWsPort = DEFAULT_WS_PORT;
  global.wsInterface = TRUSTED_LOOPBACK;
  global.wsPort = cli.wsPort;
}

export default setupGlobals;
