// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import Api from '@parity/api';
import { action, observable } from 'mobx';
import isElectron from 'is-electron';
import light from '@parity/light.js';
import store from 'store';

const electron = isElectron() ? window.require('electron') : null;

const LS_PREFIX = '__paritylight::';
const LS_KEY = `${LS_PREFIX}secureToken`;

export default class ParityStore {
  @observable downloadProgress = 0;
  @observable isApiConnected = false;
  @observable isParityRunning = false;
  @observable token = null;

  constructor () {
    // Retrieve token from localStorage
    const token = store.get(LS_KEY);
    if (token) {
      this.setToken(token);
    }

    if (!electron) {
      console.log(
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

    // Set download progress
    ipcRenderer.on('parity-download-progress', (_, progress) => {
      this.setDownloadProgress(progress);
    });
  }

  connectToApi = () => {
    let provider = 'ws://127.0.0.1:8546'; // Default provider to be used in localhost:3000
    if (electron) {
      const { remote } = electron;
      const wsInterface = remote.getGlobal('wsInterface');
      const wsPort = remote.getGlobal('wsPort');
      if (wsInterface && wsPort) {
        provider = `ws://${wsInterface}:${wsPort}`;
      }
    }

    const api = new Api(
      new Api.Provider.Ws(
        provider,
        this.token.replace(/[^a-zA-Z0-9]/g, '') // Sanitize token
      )
    );

    // Initialize the light.js lib
    light.setApi(api);

    // TODO This is not working
    // api.on('connected', () => console.log('ehdsfa'));
    // api.on('disconnected', () => console.log('ehdsfa'));
    // So instead, we poll every 1s
    setInterval(() => {
      this.setIsApiConnected(api.isConnected);
    }, 1000);
  };

  requestNewToken = () => {
    const { ipcRenderer } = electron;

    // Request new token from Electron
    ipcRenderer.send('asynchronous-message', 'signer-new-token');
    ipcRenderer.once('asynchronous-reply', (_, token) => {
      if (!token) {
        return;
      }
      // If `parity signer new-token` has successfully given us a token back,
      // then we submit it
      this.setToken(token);
    });
  };

  @action
  setDownloadProgress = downloadProgress => {
    this.downloadProgress = downloadProgress;
  };

  @action
  setIsApiConnected = isApiConnected => {
    if (isApiConnected === this.isApiConnected) {
      return;
    }

    this.isApiConnected = isApiConnected;
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
