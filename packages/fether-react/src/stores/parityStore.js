// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from 'mobx';
import Api from '@parity/api';
import isElectron from 'is-electron';
import light from '@parity/light.js';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { timer } from 'rxjs';

import Debug from '../utils/debug';

const debug = Debug('parityStore');
const electron = isElectron() ? window.require('electron') : null;

export class ParityStore {
  // TODO This is not working
  // api.on('connected', () => ...);
  // api.on('disconnected', () => ...);
  // So instead, we poll every 1s
  isApiConnected$ = timer(0, 1000).pipe(
    map(_ => Boolean(this.api && this.api.isConnected)),
    distinctUntilChanged()
  );

  @observable
  isParityRunning = false;

  constructor () {
    this.connectToApi();

    if (!electron) {
      debug(
        'Not in Electron, ParityStore will only have limited capabilities.'
      );
      return;
    }

    const { ipcRenderer, remote } = electron;

    // Check if isParityRunning
    this.setIsParityRunning(!!remote.getGlobal('isParityRunning'));
    // We also listen to future changes
    ipcRenderer.on('parity-running', (_, isParityRunning) => {
      this.setIsParityRunning(isParityRunning);
    });
  }

  connectToApi = () => {
    // Get the provider, optionally from --ws-interface and --ws-port flags
    const [defaultInterface, defaultPort] = ['127.0.0.1', '8546'];
    let provider = `ws://${defaultInterface}:${defaultPort}`;
    if (electron) {
      const { remote } = electron;
      const wsInterface = remote.getGlobal('wsInterface');
      const wsPort = remote.getGlobal('wsPort');
      provider = `ws://${wsInterface || defaultInterface}:${wsPort ||
        defaultPort}`;
    }

    debug(`Connecting to ${provider}.`);
    const api = new Api(new Api.Provider.Ws(provider));

    // Initialize the light.js lib
    light.setApi(api);

    // Also set api as member for React Components to use it if needed
    this.api = api;
  };

  @action
  setIsParityRunning = isParityRunning => {
    if (isParityRunning === this.isParityRunning) {
      return;
    }

    this.isParityRunning = isParityRunning;
  };
}

export default new ParityStore();
