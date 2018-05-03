// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { dialog } = require('electron');

const {
  parity: { channel }
} = require('../../package.json');

module.exports = (err, message = 'An error occurred.') => {
  console.error(err);
  dialog.showMessageBox(
    {
      buttons: ['OK'],
      detail: `Please attach the following debugging info:
OS: ${process.platform}
Arch: ${process.arch}
Channel: ${channel}
Error: ${err.message}

Please also attach the contents of the following file:
${parityPath()}.log`,
      message: `${message} Please file an issue at https://github.com/parity-js/shell/issues.`,
      title: 'Parity Error',
      type: 'error'
    },
    () => app.exit(1)
  );
};
