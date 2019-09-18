// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import ipcChannel from './index.js';

describe('ipcChannel', () => {
  test.skip('should send & receive msgs', done => {
    ipcChannel.init('/var/tmp/ipc.ipc').then(r => {
      ipcChannel.send('{"jsonrpc":"2.0","id":1,"method":"parity_versionInfo"}');
    });

    ipcChannel.on('message', x => {
      console.log('Got message', x);
      done();
    });
  });
});
