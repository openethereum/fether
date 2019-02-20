// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { addMenu } from '../menu';
import Pino from '../utils/pino';

const pino = Pino();

function setupMenu (fetherApp) {
  // Add Fether menu
  addMenu();

  /**
   * Note that the Fether window must be configured with a "frame"
   * on Windows 10 or Linux Mint. If you configure `setAutoHideMenuBar(false)`
   * and `setMenuBarVisibility(true)` then the menu does not auto-hide and
   * you may not toggle the Fether window to be shown/hidden.
   * However, if you configure `setAutoHideMenuBar(true)`
   * and `setMenuBarVisibility(false)` then you may toggle the Fether window
   * to be shown/hidden in the frame by pressing or holding one of the ALT keys.
   */
  fetherApp.win.setAutoHideMenuBar(true); // Pressing ALT shows menu bar
  fetherApp.win.setMenuBarVisibility(false);

  pino.info('Finished configuring Electron menu');
}

export default setupMenu;
