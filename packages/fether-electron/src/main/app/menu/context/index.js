// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { getContextMenuTemplate } from '../template';

const { Menu } = electron;

let hasCalledInitMenu = false;

class FetherContextMenu {
  constructor (fetherApp) {
    if (hasCalledInitMenu) {
      throw new Error(
        'Unable to initialise Fether context menu more than once'
      );
    }

    this.setMenuTemplate(getContextMenuTemplate(fetherApp));
    this.buildMenuTemplate(this.menuTemplate);
  }

  getMenu = () => {
    return this.builtMenu;
  };

  setMenuTemplate = menuTemplate => {
    this.menuTemplate = menuTemplate;
  };

  buildMenuTemplate = menuTemplate => {
    this.builtMenu = Menu.buildFromTemplate(menuTemplate);
  };
}

export default FetherContextMenu;
