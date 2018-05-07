// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const fs = require('fs');
const util = require('util');

const parityPath = require('../utils/parityPath');

const fsExists = util.promisify(fs.stat);

module.exports = () => fsExists(parityPath());
