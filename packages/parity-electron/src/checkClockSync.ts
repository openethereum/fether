// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const sntp = require('sntp');

export const MAX_TIME_DRIFT = 10000; // seconds

export const checkClockSync = () => {
  return sntp.time().then(({ t: timeDrift }) => ({
    isSync: timeDrift < MAX_TIME_DRIFT,
    timeDrift
  }));
};
