// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { screen } from 'electron';

// https://ourcodeworld.com/articles/read/285/how-to-get-the-screen-width-and-height-in-electron-framework
function getScreenResolution () {
  const mainScreen = screen.getPrimaryDisplay();
  const mainScreenDimensions = mainScreen.size;

  return {
    x: mainScreenDimensions.width,
    y: mainScreenDimensions.height
  };
}

export default getScreenResolution;
