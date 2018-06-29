// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { signerNewToken } from '@parity/electron';

/**
 * Handle all asynchronous messages from renderer to main.
 */
export default async (event, arg) => {
  switch (arg) {
    case 'signer-new-token': {
      const token = await signerNewToken();
      // Send back the token to the renderer process
      event.sender.send('asynchronous-reply', token);
      break;
    }
    default:
  }
};
