// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import debug from 'debug';

let logger = debug;

export const setLogger = _logger => {
  logger = _logger;
};

export default () => logger;
