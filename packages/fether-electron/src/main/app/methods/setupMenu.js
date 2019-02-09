// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import FetherMenu from '../menu';
import Pino from '../utils/pino';

const pino = Pino();

function setupMenu (fetherApp) {
  // Add Fether menu
  fetherApp.menu = new FetherMenu();
  fetherApp.menu.setMenu(fetherApp, undefined);

  /**
   * Toggle the Fether menu bar in the frame.
   * If not shown by default then when shown it may crop the bottom
   * of the window when menu open/close toggled on Windows.
   */
  fetherApp.win.setAutoHideMenuBar(false); // Pressing ALT shows menu bar
  fetherApp.win.setMenuBarVisibility(true);

  pino.info('Finished configuring Electron menu');
}

export default setupMenu;
