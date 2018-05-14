// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { nodeHealth$, syncing$ } from '@parity/light.js';

import light from '../hoc';
import './Health.css';

export const STATUS_OK = 'ok';
export const STATUS_WARN = 'needsAttention';
export const STATUS_BAD = 'bad';

/**
 * Calculate the average health.
 * It's currently here too: https://github.com/parity-js/mobx/blob/master/src/parity/nodeHealth.js
 * and here https://github.com/parity-js/shared/blob/43837f3a6a8fe84f5e756b4df1643b28eea00dc0/src/redux/providers/statusReducer.js
 * TODO Factorize this.
 */
const averageHealth = nodeHealth => {
  if (!nodeHealth || !Object.keys(nodeHealth).length) {
    return {
      status: STATUS_BAD,
      message: ['Unable to fetch node health.']
    };
  }

  // Find out if there are bad statuses
  const bad = Object.values(nodeHealth)
    .filter(x => x)
    .map(({ status }) => status)
    .find(s => s === STATUS_BAD);
  // Find out if there are needsAttention statuses
  const needsAttention = Object.keys(nodeHealth)
    .filter(key => key !== 'time')
    .map(key => nodeHealth[key])
    .filter(x => x)
    .map(({ status }) => status)
    .find(s => s === STATUS_WARN);
  // Get all non-empty messages from all statuses
  const message = Object.values(nodeHealth)
    .map(({ message }) => message)
    .filter(x => x);

  return {
    status: bad || needsAttention || STATUS_OK,
    message
  };
};

@light({
  nodeHealth: nodeHealth$,
  syncing: syncing$
})
class Health extends Component {
  render() {
    const { nodeHealth, syncing } = this.props;
    const { message, status } = averageHealth(nodeHealth);

    // TODO No inline style, just putting here for prototyping -Amaury
    return (
      <p className="tooltip" style={{ flexGrow: 1 }}>
        {status}

        <span className="tooltiptext">
          {status !== STATUS_OK && <span>{message}</span>}
          {syncing && <span>Syncing: {JSON.stringify(syncing)}</span>}
          {nodeHealth && (
            <span>
              Peers: {nodeHealth.peers.details[0]}/{nodeHealth.peers.details[1]}
            </span>
          )}
        </span>
      </p>
    );
  }
}

export default Health;
