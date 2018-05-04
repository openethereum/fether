// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { computed, action, observable } from 'mobx';
import isElectron from 'is-electron';
import store from 'store';

import ethereumIcon from '../assets/img/tokens/ethereum.png';

const electron = isElectron() ? window.require('electron') : null;

const LS_PREFIX = '__paritylight::';
const LS_KEY = `${LS_PREFIX}secureToken`;

export default class ElectronStore {
  @observable downloadProgress = 0;
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
        'Not in Electron, ElectronStore will only have limited capabilities.'
      );
      return;
    }

    const { ipcRenderer, remote } = electron;

    // Set/Update isParityRunning
    this.setIsParityRunning(!!remote.getGlobal('isParityRunning'));
    ipcRenderer.on('parity-running', (_, isParityRunning) => {
      this.setIsParityRunning(isParityRunning);

      // Request new token if there's none
      if (!token) {
        this.requestNewToken();
      }
    });

    // Set download progress
    ipcRenderer.on('parity-download-progress', (_, progress) => {
      this.setDownloadProgress(progress);
    });
  }

  /**
   * Tell the app that we're ready to connect to the api
   */
  @computed
  get isReady () {
    return !!this.token && (electron ? this.isParityRunning : true);
  }

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
  setIsParityRunning = isParityRunning => {
    this.isParityRunning = isParityRunning;
  };

  @action
  setToken = token => {
    this.token = token;
    this.updateLS();
  };

  updateLS = () => store.set(LS_KEY, this.token);
}
