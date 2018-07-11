// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const sntp = require('sntp');

export const checkTime = () => {
  return sntp.time().then(({t}) => ({drift: t}));
}