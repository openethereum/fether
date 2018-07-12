// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const { time } = require('sntp');

export const MAX_TIME_DRIFT = 10000; // milliseconds

export const checkClockSync : () => Promise<{isClockSync: boolean, timeDrift: number}> = () => {
  return time().then(({ t: timeDrift }) => ({
    isClockSync: timeDrift < MAX_TIME_DRIFT,
    timeDrift
  }));
};
