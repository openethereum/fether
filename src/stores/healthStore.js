// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, computed, observable } from 'mobx';
import { nodeHealth$, syncing$ } from '@parity/light.js';

import parityStore from './parityStore';

// List here all possible states of our health store. Each state can have a
// payload.
export const STATUS = {
  CANTCONNECT: 'CANTCONNECT', // Can't connect to Parity's api
  CLOCKNOTSYNC: 'CLOCKNOTSYNC', // Local clock is not sync
  DOWNLOADING: 'DOWNLOADING', // Currently downloading Parity
  GOOD: 'GOOD', // Everything's fine
  NOINTERNET: 'NOINTERNET', // No network connection
  OTHER: 'OTHER', // Unknown state, might have a payload
  RUNNING: 'RUNNING', // Currently try to launch Parity
  SYNCING: 'SYNCING' // Obvious
};

class HealthStore {
  @observable nodeHealth;
  @observable syncing;

  constructor () {
    nodeHealth$().subscribe(this.setNodeHealth);
    syncing$().subscribe(this.setSyncing);
  }

  /**
   * Calculate the current status.
   *
   * @return [Object{ status: StatusEnum, payload: Any}] - An object which
   * represents the current status, with a custom payload.
   */
  @computed
  get health () {
    // Check download progress
    if (parityStore.downloadProgress > 0 && !parityStore.isParityRunning) {
      return {
        status: STATUS.DOWNLOADING,
        payload: { percentage: Math.round(parityStore.downloadProgress * 100) }
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
      const percentage = Math.round(
        ((currentBlock - startingBlock) * 100) / (highestBlock - startingBlock)
      );
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
    console.log(message); // TODO WIP, to catch potential other messages

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

    if (
      message.includes(
        'Your clock is not in sync. Detected difference is too big for the protocol to work'
      )
    ) {
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
