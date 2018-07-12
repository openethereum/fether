// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { app } from 'electron';
import fs from 'fs';
import { multistream } from 'pino-multi-stream';
import Pino from 'pino';

import { name } from '../../../package.json';

// We cannot use `app.getPath('userData')` in the body of the module (outside of
// the exports) because then it is evaluated right away, before userData is even
// set in index.js
export default opts => {
  // Pino by default outputs JSON. We prettify that.
  const pretty = Pino.pretty();
  pretty.pipe(process.stdout);

  // Create userData folder if it doesn't exist
  try {
    fs.statSync(app.getPath('userData'));
  } catch (e) {
    fs.mkdirSync(app.getPath('userData'));
  }

  // Create 2 output streams:
  // - fether.log file (raw JSON)
  // - stdout (prettified output)
  const streams = [
    {
      level: 'info',
      stream: fs.createWriteStream(`${app.getPath('userData')}/${name}.log`)
    },
    { level: 'info', stream: pretty }
  ];

  return Pino({ name, ...opts }, multistream(streams));
}
