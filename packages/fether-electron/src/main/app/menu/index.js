// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import { getTemplate } from './template';

const { Menu } = electron;

let hasCalledInitFetherMenu = false;

class FetherMenu {
  constructor () {
    if (hasCalledInitFetherMenu) {
      throw new Error('Unable to initialise Fether menu more than once');
    }
  }

  getMenu = () => {
    return Menu.getApplicationMenu();
  };

  getMenuTemplate = fetherApp => {
    return getTemplate(fetherApp);
  };

  getDefaultBuiltMenuTemplate = fetherApp => {
    return Menu.buildFromTemplate(this.getMenuTemplate(fetherApp));
  };

  createCustomBuiltMenuTemplate = customMenuTemplate => {
    return Menu.buildFromTemplate(customMenuTemplate);
  };

  setMenu = (fetherApp, customBuiltMenuTemplate) => {
    const defaultBuiltMenuTemplate = this.getDefaultBuiltMenuTemplate(
      fetherApp
    );
    Menu.setApplicationMenu(
      customBuiltMenuTemplate || defaultBuiltMenuTemplate
    );
  };

  updateMenu = fetherApp => {
    const newMenu = this.getMenuTemplate(fetherApp);
    const customBuiltMenuTemplate = this.createCustomBuiltMenuTemplate(newMenu);
    this.setMenu(fetherApp, customBuiltMenuTemplate);
  };
}

export default FetherMenu;
