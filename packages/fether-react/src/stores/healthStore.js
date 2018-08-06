// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, computed, observable } from 'mobx';
import BigNumber from 'bignumber.js';
import isElectron from 'is-electron';

import { peerCount$, syncing$ } from '@parity/light.js';

import Debug from '../utils/debug';
import parityStore from './parityStore';

const debug = Debug('healthStore');
const electron = isElectron() ? window.require('electron') : null;

// List here all possible states of our health store. Each state can have a
// payload.
export const STATUS = {
  CANTCONNECT: Symbol('CANTCONNECT'), // Can't connect to Parity's api
  CLOCKNOTSYNC: Symbol('CLOCKNOTSYNC'), // Local clock is not sync
  DOWNLOADING: Symbol('DOWNLOADING'), // Currently downloading Parity
  GOOD: Symbol('GOOD'), // Everything's fine
  NOPEERS: Symbol('NOPEERS'), // Not connected to any peers
  RUNNING: Symbol('RUNNING'), // Parity is running (only checked at startup)
  SYNCING: Symbol('SYNCING') // Obvious
};

export class HealthStore {
  @observable peerCount;
  @observable syncing;
  @observable clockSync;

  constructor () {
    peerCount$(({withoutLoading: true})).subscribe(this.setPeerCount);
    syncing$().subscribe(this.setSyncing);

    if (!electron) {
      debug(
        'Not in Electron, ignoring clock sync verification.'
      );
      return;
    }

    const { ipcRenderer } = electron;
    ipcRenderer.send('asynchronous-message', 'check-clock-sync');
    ipcRenderer.once('check-clock-sync-reply', (_, clockSync) => {
      this.setClockSync(clockSync);
    });
  }

  /**
   * Calculate the current status.
   *
   * @return {Object{ status: StatusEnum, payload: Any}} - An object which
   * represents the current status, with a custom payload.
   */
  @computed
  get health () {
    // Check download progress
    if (parityStore.downloadProgress > 0 && !parityStore.isParityRunning) {
      return {
        status: STATUS.DOWNLOADING,
        payload: {
          percentage: new BigNumber(
            Math.round(parityStore.downloadProgress * 100)
          )
        }
      };
    }

    // Check if we are currently launching
    if (parityStore.isParityRunning && !parityStore.isApiConnected) {
      return {
        status: STATUS.RUNNING
      };
    }

    // Check if we get responses from the WS server
    if (
      !parityStore.isApiConnected
    ) {
      return {
        status: STATUS.CANTCONNECT
      };
    }

    // At this point we have a successful connection to parity

    // Check if we're syncing
    if (this.syncing) {
      const { currentBlock, highestBlock, startingBlock } = this.syncing;
      const percentage = currentBlock
        .minus(startingBlock)
        .mul(100)
        .div(highestBlock.minus(startingBlock));

      return {
        status: STATUS.SYNCING,
        payload: { currentBlock, highestBlock, percentage, startingBlock }
      };
    }

    if (this.clockSync && !this.clockSync.isClockSync) {
      return { status: STATUS.CLOCKNOTSYNC };
    }

    if (this.peerCount && this.peerCount.eq(0)) {
      return { status: STATUS.NOPEERS };
    }

    return {
      status: STATUS.GOOD
    };
  }

  @action
  setPeerCount = peerCount => {
    this.peerCount = peerCount;
  };

  @action
  setClockSync = clockSync => {
    this.clockSync = clockSync;
  };

  @action
  setSyncing = syncing => {
    this.syncing = syncing;
  };
}

export default new HealthStore();
