// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { runParity } = require('../operations/runParity');
const signerNewToken = require('../operations/signerNewToken');

/**
 * Handle all asynchronous messages from renderer to main.
 */
module.exports = (event, arg) => {
  switch (arg) {
    case 'signer-new-token': {
      signerNewToken(event);
      break;
    }
    default:
  }
};
