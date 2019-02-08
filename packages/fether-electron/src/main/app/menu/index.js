// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import { template } from './template';

const { Menu } = electron;

const menu = Menu.buildFromTemplate(template);

const getMenu = () => {
  return Menu.getApplicationMenu();
};

const addMenu = () => {
  Menu.setApplicationMenu(menu);
};

export { addMenu, getMenu };
