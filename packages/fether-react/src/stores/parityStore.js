// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from 'mobx';
import Api from '@parity/api';
import light from '@parity/light.js';
import { distinctUntilChanged, map } from 'rxjs/operators';
import store from 'store';
import { timer } from 'rxjs';

import Debug from '../utils/debug';
import LS_PREFIX from './utils/lsPrefix';

const debug = Debug('parityStore');

// The preload scripts injects `electron` into `window`
const electron = window.electron;

const LS_KEY = `${LS_PREFIX}::secureToken`;

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

  @observable
  token = null;

  @observable
  api = undefined;

  constructor () {
    // Retrieve token from localStorage
    const token = store.get(LS_KEY);
    if (token) {
      debug('Got token from localStorage.');
      this.setToken(token);
    }

    // FIXME - consider moving to start of this constructor block since
    // if `setToken` method is called then `connectToApi` is called, which
    // requires `electron` to be defined
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
    const api = new Api(
      new Api.Provider.Ws(
        provider,
        this.token.replace(/[^a-zA-Z0-9]/g, '') // Sanitize token
      )
    );

    // Initialize the light.js lib
    light.setApi(api);

    // Also set api as member for React Components to use it if needed
    this.api = api;
  };

  requestNewToken = () => {
    const { ipcRenderer } = electron;

    // Request new token from Electron
    debug('Requesting new token.');
    ipcRenderer.send('asynchronous-message', 'signer-new-token');
    ipcRenderer.once('signer-new-token-reply', (_, token) => {
      if (!token) {
        return;
      }
      // If `parity signer new-token` has successfully given us a token back,
      // then we submit it
      debug('Successfully received new token.');
      this.setToken(token);
    });
  };

  @action
  setIsParityRunning = isParityRunning => {
    if (isParityRunning === this.isParityRunning) {
      return;
    }

    this.isParityRunning = isParityRunning;

    // Request new token if parity's running but we still don't have a token
    if (isParityRunning && !this.token) {
      this.requestNewToken();
    }
  };

  @action
  setToken = token => {
    if (token === this.token) {
      return;
    }

    this.token = token;

    // If we receive a new token, then we try to connect to the Api with this
    // new token
    this.connectToApi();

    this.updateLS();
  };

  updateLS = () => store.set(LS_KEY, this.token);
}

export default new ParityStore();
