// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import extend from 'extend';

import { DEFAULT_OPTIONS, SECURITY_OPTIONS, TASKBAR_OPTIONS } from './config';

let hasCalledInitFetherAppOptions = false;

class FetherAppOptions {
  options = {};

  create = (withTaskbar, customOptions) => {
    if (hasCalledInitFetherAppOptions) {
      throw new Error('Unable to initialise Fether app options more than once');
    }

    // Allow user to get/set options prior or to pass custom options
    // Security options should be extended last
    this.options = withTaskbar
      ? extend(
        this.options,
        DEFAULT_OPTIONS,
        TASKBAR_OPTIONS,
        customOptions || {},
        SECURITY_OPTIONS
      )
      : extend(
        this.options,
        DEFAULT_OPTIONS,
        customOptions || {},
        SECURITY_OPTIONS
      );

    return this.options;
  };

  get = opt => {
    return this.options[opt];
  };

  set = (opt, val) => {
    this.options[opt] = val;
  };
}

export default FetherAppOptions;
