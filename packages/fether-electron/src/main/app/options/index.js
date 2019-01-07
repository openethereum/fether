// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import extend from 'extend';

import { DEFAULT_OPTIONS, TASKBAR_OPTIONS } from './config';

let hasCalledInitFetherAppOptions = false;

class FetherAppOptions {
  options = {};

  create = (withTaskbar, customOptions) => {
    if (hasCalledInitFetherAppOptions) {
      throw new Error('Unable to initialise Fether app options more than once');
    }

    // Allow user to get/set options prior or to pass custom options
    this.options = withTaskbar
      ? extend(
        this.options,
        DEFAULT_OPTIONS,
        TASKBAR_OPTIONS,
        customOptions || {}
      )
      : extend(this.options, DEFAULT_OPTIONS, customOptions || {});

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
