// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

function onWindowClose (fetherApp) {
  const { processSaveWinPosition, windowClear } = fetherApp;

  processSaveWinPosition(fetherApp);
  windowClear(fetherApp);
}

export default onWindowClose;
