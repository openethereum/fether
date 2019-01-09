// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import path from 'path';
import url from 'url';

import staticPath from '../../utils/staticPath';

const INDEX_HTML_PATH =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(staticPath, 'build', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

// Icon path differs when started with `yarn electron` or `yarn start`
const ICON_PATH =
  process.env.ELECTRON_START_ICON || process.env.SKIP_PREFLIGHT_CHECK
    ? 'src/main/app/options/config/icons/parity-ethereum-fether-icon.png'
    : path.join(__dirname, 'icons', 'parity-ethereum-fether-icon.png');

const shouldUseDevTools = process.env.NODE_ENV !== 'production';

// API docs: https://electronjs.org/docs/api/browser-window
const DEFAULT_OPTIONS = {
  alwaysOnTop: true,
  frame: true,
  height: 640,
  index: INDEX_HTML_PATH,
  resizable: false,
  show: true,
  tabbingIdentifier: 'parity',
  webPreferences: {
    devTools: shouldUseDevTools, // Security
    enableRemoteModule: false
  },
  width: 360,
  withTaskbar: false
};

const windowPosition =
  process.platform === 'win32' ? 'trayBottomCenter' : 'trayCenter';

const TASKBAR_OPTIONS = {
  dir: staticPath,
  frame: false,
  hasShadow: true,
  height: 464,
  icon: ICON_PATH,
  show: false, // Run showWindow later when taskbar has loaded in FetherApp
  showDockIcon: true,
  tooltip: 'Parity Fether',
  windowPosition: windowPosition, // Required
  width: 352,
  withTaskbar: true
};

export { DEFAULT_OPTIONS, TASKBAR_OPTIONS };
