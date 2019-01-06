// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import extend from 'extend';

const DEFAULT_OPTIONS = {
  height: 640,
  resizable: false,
  width: 360
};

const TASKBAR_OPTIONS = {};

let hasCalledInitFetherAppOptions = false;

class FetherAppOptions {
  options = {};

  create = withTaskbar => {
    if (hasCalledInitFetherAppOptions) {
      throw new Error('Unable to initialise Fether app options more than once');
    }

    this.options = withTaskbar
      ? extend(DEFAULT_OPTIONS, TASKBAR_OPTIONS)
      : DEFAULT_OPTIONS;

    return this.options;
  };
}

export default FetherAppOptions;
