// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';

import { chainName$, isLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import withHealth, { STATUS } from '../utils/withHealth';

@light({
  chainName: chainName$
})
@withHealth
class Health extends Component {
  render () {
    return (
      <div className='status'>
        <span className={['status_icon', this.statusToClassName()].join(' ')}>
          <svg viewBox='0 0 20 20'>
            <circle fill='#DDD' cx='10' cy='10' r='10' />
          </svg>
        </span>
        <span className='status_text'>{this.statusToFriendlyMessage()}</span>
      </div>
    );
  }

  /**
   * Get className from the status icon from the status enum
   */
  statusToClassName = () => {
    const {
      health: { status }
    } = this.props;
    switch (status) {
      case STATUS.GOOD:
        return '-good';
      case STATUS.DOWNLOADING:
      case STATUS.LAUNCHING:
      case STATUS.SYNCING:
        return '-syncing';
      default:
        return '-bad';
    }
  };

  statusToFriendlyMessage = () => {
    const {
      health: { status, payload },
      chainName
    } = this.props;

    const chainNameAppend = isLoading(chainName) ? '' : ` (${chainName})`;

    switch (status) {
      case STATUS.NO_NODE_CONNECTED_AND_NO_INTERNET:
        return 'No internet. No nodes connected';
      case STATUS.DOWNLOADING:
        return `Downloading Parity Ethereum... (${payload.percentage}%)`;
      case STATUS.LAUNCHING:
        return 'Launching the node...';
      case STATUS.NODE_CONNECTED_AND_NO_INTERNET:
        return 'No internet. Connected to node.';
      case STATUS.NO_CLOCK_SYNC:
        return 'Clock of host not in sync';
      case STATUS.NO_PEERS:
        return 'No peer node connections';
      case STATUS.SYNCING:
        return `Syncing...${
          payload && payload.percentage && payload.percentage.gt(0)
            ? ` (${payload.percentage.toFixed(0)}%)`
            : ''
        }${chainNameAppend}`;
      case STATUS.GOOD:
        return `Synced${chainNameAppend}`;
      default:
        return JSON.stringify(payload); // Just in case payload is an object
    }
  };
}

export default Health;
