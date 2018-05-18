// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');
const fs = require('fs');
const { multistream } = require('pino-multi-stream');
const pino = require('pino');

// Pino by default outputs JSON. We prettify that.
const pretty = pino.pretty();
pretty.pipe(process.stdout);

// Create 2 output streams:
// - parity.log file (raw JSON)
// - stdout (prettified output)
const streams = [
  {
    level: 'info',
    stream: fs.createWriteStream(`${app.getPath('userData')}/parity.log`)
  },
  { level: 'info', stream: pretty }
];

/**
 * Usage: const pino = require('../path/to/pino')({ name: 'electron' });
 *
 * @param {Object} opts - Options to pass to pino.
 */
module.exports = opts => pino(opts, multistream(streams));
