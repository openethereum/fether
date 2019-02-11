// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import cli from '../cli';

function setupGlobals () {
  // Globals for fether-react parityStore
  global.wsInterface = cli.wsInterface;
  global.wsPort = cli.wsPort;
}

export default setupGlobals;
