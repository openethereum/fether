// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import * as Sntp from 'sntp';

/**
 * Check if your local time is sync with the SNTP time. Unsync times prevents
 * syncing on some nodes.
 */
export const checkClockSync = async () => {
  const time = await Sntp.time({ timeout: 3000 });
  return time;
};
