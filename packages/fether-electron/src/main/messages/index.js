// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import signerNewToken from '../operations/signerNewToken';

/**
 * Handle all asynchronous messages from renderer to main.
 */
export default (event, arg) => {
  switch (arg) {
    case 'signer-new-token': {
      signerNewToken(event);
      break;
    }
    default:
  }
};
