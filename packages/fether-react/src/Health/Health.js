// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';

import { chainName$, isLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import withHealth from '../utils/withHealth';

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
    if (status.good) {
      return '-good';
    } else if (status.downloading || status.launching || status.syncing) {
      return '-syncing';
    } else {
      return '-bad';
    }
  };

  statusToFriendlyMessage = () => {
    const {
      health: { status, payload },
      chainName
    } = this.props;

    const chainNameAppend = isLoading(chainName) ? '' : ` (${chainName})`;

    if (!status.nodeConnected && !status.internet) {
      return 'No internet. No nodes connected';
    } else if (status.downloading) {
      return `Downloading Parity Ethereum... (${
        payload.downloading.syncPercentage
      }%)`;
    } else if (status.launching) {
      return 'Launching the node...';
    } else if (status.nodeConnected && !status.internet) {
      return 'No internet. Connected to node';
    } else if (!status.clockSync) {
      return 'Clock of host not in sync';
    } else if (!status.peers) {
      return 'No peer node connections';
    } else if (status.syncing) {
      return `Syncing...${
        payload &&
        payload.downloading &&
        payload.downloading.syncPercentage &&
        payload.downloading.syncPercentage.gt(0)
          ? ` (${payload.downloading.syncPercentage.toFixed(0)}%)`
          : ''
      }${chainNameAppend}`;
    } else if (status.good) {
      return `Synced${chainNameAppend}`;
    } else {
      return JSON.stringify(payload) || ''; // Just in case payload is an object
    }
  };
}

export default Health;
