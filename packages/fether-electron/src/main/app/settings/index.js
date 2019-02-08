// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import settings from 'electron-settings';

const hasSavedWindowPosition = () => {
  return settings.has('position.x') && settings.has('position.y');
};

const getSavedWindowPosition = () => {
  return {
    x: settings.get('position.x'),
    y: settings.get('position.y')
  };
};

/**
 * Returns the latest window resolution if it differs from the previous resolution.
 * Note that the previous window resolution may be undefined if being changed in settings.
 */
const saveWindowPosition = position => {
  settings.set('position', {
    x: position.x,
    y: position.y
  });
};

export { getSavedWindowPosition, hasSavedWindowPosition, saveWindowPosition };
