// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

const { promisify } = require('util');
const ps = require('ps-node');

const lookup = promisify(ps.lookup);
