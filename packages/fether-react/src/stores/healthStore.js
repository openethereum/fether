// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, computed, observable } from 'mobx';
import BigNumber from 'bignumber.js';
import isElectron from 'is-electron';

import { nodeHealth$, syncing$ } from '@parity/light.js';
import parityStore from './parityStore';

const electron = isElectron() ? window.require('electron') : null;

// List here all possible states of our health store. Each state can have a
// payload.
export const STATUS = {
  CANTCONNECT: 'CANTCONNECT', // Can't connect to Parity's api
  CLOCKNOTSYNC: 'CLOCKNOTSYNC', // Local clock is not sync
  DOWNLOADING: 'DOWNLOADING', // Currently downloading Parity
  GOOD: 'GOOD', // Everything's fine
  NOINTERNET: 'NOINTERNET', // No network connection
  OTHER: 'OTHER', // Unknown state, might have a payload
  RUNNING: 'RUNNING', // Parity is running (only checked at startup)
  SYNCING: 'SYNCING' // Obvious
};

export const MAX_TIME_DRIFT = 10000; // seconds

export class HealthStore {
  @observable nodeHealth;
  @observable syncing;
  @observable timeDrift;

  constructor () {
    nodeHealth$().subscribe(this.setNodeHealth);
    syncing$().subscribe(this.setSyncing);

    const { ipcRenderer } = electron;
    ipcRenderer.send('asynchronous-message', 'check-time');
    ipcRenderer.once('check-time-reply', (_, {drift}) => {
      this.timeDrift = drift;
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
      !parityStore.isApiConnected ||
      !this.nodeHealth ||
      !Object.keys(this.nodeHealth).length
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

    // Find out if there are bad statuses
    const bad = Object.values(this.nodeHealth)
      .filter(x => x)
      .map(({ status }) => status)
      .find(s => s === 'bad');
    // Find out if there are needsAttention statuses
    const needsAttention = Object.keys(this.nodeHealth)
      .filter(key => key !== 'time')
      .map(key => this.nodeHealth[key])
      .filter(x => x)
      .map(({ status }) => status)
      .find(s => s === 'needsattention');

    if (!bad && !needsAttention) {
      return {
        status: STATUS.GOOD
      };
    }

    // Now we have a bad or a needsattention message

    // Get all non-empty messages from all statuses
    const details = Object.values(this.nodeHealth)
      .map(({ message }) => message)
      .filter(x => x);

    // If status is bad or needsattention, there should be an associated
    // message. Just in case, we do an additional test.
    if (!details || !details.length) {
      return { status: STATUS.OTHER };
    }

    const message = details[0];

    if (
      message ===
      "Your node is still syncing, the values you see might be outdated. Wait until it's fully synced."
    ) {
      return { status: STATUS.SYNCING };
    }

    if (
      message ===
      'You are not connected to any peers. There is most likely some network issue. Fix connectivity.'
    ) {
      return { status: STATUS.NOINTERNET, payload: message };
    }

    if (this.timeDrift !== undefined && this.timeDrift > MAX_TIME_DRIFT) {
      return { status: STATUS.CLOCKNOTSYNC, payload: message };
    }

    return { status: STATUS.OTHER, payload: message };
  }

  @action
  setNodeHealth = nodeHealth => {
    this.nodeHealth = nodeHealth;
  };

  @action
  setSyncing = syncing => {
    this.syncing = syncing;
  };
}

export default new HealthStore();
