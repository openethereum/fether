// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { app } = require('electron');
const cli = require('commander');
const fs = require('fs');
const omit = require('lodash/omit');
const { spawn } = require('child_process');

const parityPath = require('../utils/parityPath');
const { version } = require('../../package.json');

cli
  .version(version)
  .allowUnknownOption()
  .option(
    '--ui-dev',
    'The Light Wallet will load http://localhost:3000. WARNING: Only use this is you plan on developing on Parity UI.'
  )
  .parse(process.argv);

let parityArgv = null; // Args to pass to `parity` command

module.exports = cli;
