// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, computed, observable } from 'mobx';
import { nodeHealth$ } from '@parity/light.js';

import parityStore from './parityStore';

export const STATUS_OK = 'ok';
export const STATUS_WARN = 'needsAttention';
export const STATUS_BAD = 'bad';

class HealthStore {
  @observable nodeHealth;

  constructor () {
    nodeHealth$().subscribe(this.setNodeHealth);
  }

  /**
   * Calculate the average health.
   *
   * @return [Object{ status: String, messages: Array<String>}] - An object
   * which represents the average health. Status has 3 states, and message
   * contains details.
   */
  @computed
  get averageHealth () {
    // Check download progress
    if (parityStore.downloadProgress > 0 && !parityStore.isParityRunning) {
      return {
        status: STATUS_WARN,
        message: [
          `Downloading... (${Math.round(parityStore.downloadProgress * 10000) /
            100}%)`
        ]
      };
    }

    // Check if we are currently launching
    if (parityStore.isParityRunning && !parityStore.isApiConnected) {
      return {
        status: STATUS_WARN,
        message: [`Running...`]
      };
    }

    // Check if we get responses from the WS server
    if (
      !parityStore.isApiConnected ||
      !this.nodeHealth ||
      !Object.keys(this.nodeHealth).length
    ) {
      return {
        status: STATUS_BAD,
        message: ["Can't connect to parity."]
      };
    }

    // At this point we have a successful connection to parity

    // Check if we're syncing
    // TODO

    // Find out if there are bad statuses
    const bad = Object.values(this.nodeHealth)
      .filter(x => x)
      .map(({ status }) => status)
      .find(s => s === STATUS_BAD);
    // Find out if there are needsAttention statuses
    const needsAttention = Object.keys(this.nodeHealth)
      .filter(key => key !== 'time')
      .map(key => this.nodeHealth[key])
      .filter(x => x)
      .map(({ status }) => status)
      .find(s => s === STATUS_WARN);
    // Get all non-empty messages from all statuses
    const message = Object.values(this.nodeHealth)
      .map(({ message }) => message)
      .filter(x => x);

    return {
      status: bad || needsAttention || STATUS_OK,
      message
    };
  }

  @action
  setNodeHealth = nodeHealth => {
    this.nodeHealth = nodeHealth;
  };
}

export default new HealthStore();
