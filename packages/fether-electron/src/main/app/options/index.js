// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import path from 'path';
import url from 'url';
import extend from 'extend';

import staticPath from '../utils/staticPath';

const DEFAULT_OPTIONS = {
  height: 640,
  resizable: false,
  width: 360,
  index:
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(staticPath, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
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
