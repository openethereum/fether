// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { app, dialog } from 'electron';

import { bugs, parity } from '../../../package.json';
import Pino from '../utils/pino';

const pino = Pino();

export default (err, message = 'An error occurred.') => {
  pino.error(err);
  dialog.showMessageBox(
    {
      buttons: ['OK'],
      detail: `Please attach the following debugging info:
OS: ${process.platform}
Arch: ${process.arch}
Channel: ${parity.channel}
Error: ${err.message}

Please also attach the contents of the following file:
${app.getPath('userData')}/parity.log`,
      message: `${message} Please file an issue at ${bugs.url}.`,
      title: 'Parity Error',
      type: 'error'
    },
    () => app.exit(1)
  );
};
