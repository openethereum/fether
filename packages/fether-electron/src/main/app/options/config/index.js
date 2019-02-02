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
  process.platform === 'win32'
    ? path.join(staticPath, 'assets', 'icons', 'win', 'icon.ico')
    : path.join(staticPath, 'assets', 'icons', 'icon.png');

const shouldUseDevTools = process.env.NODE_ENV !== 'production';
const shouldUseFrame = process.platform === 'win32';

const windowPosition =
  process.platform === 'win32' ? 'trayBottomCenter' : 'trayCenter';

// API docs: https://electronjs.org/docs/api/browser-window
const DEFAULT_OPTIONS = {
  alwaysOnTop: true,
  dir: staticPath,
  frame: true,
  height: 640,
  hasShadow: true,
  icon: ICON_PATH,
  index: INDEX_HTML_PATH,
  resizable: false,
  show: false, // Run showWindow later
  showDockIcon: true, // macOS usage only
  tabbingIdentifier: 'parity',
  webPreferences: {
    devTools: shouldUseDevTools, // Security
    enableRemoteModule: false
  },
  width: 360,
  windowPosition: windowPosition, // Required
  withTaskbar: false
};

const TASKBAR_OPTIONS = {
  frame: shouldUseFrame,
  height: 464,
  // On Linux the user must click the tray icon and then click the tooltip
  // to toggle the Fether window open/close
  tooltip: 'Click to toggle Fether window',
  width: 352,
  withTaskbar: true
};

export { DEFAULT_OPTIONS, TASKBAR_OPTIONS };
