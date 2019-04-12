// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { branch } from 'recompose';
import { chainName$ } from '@parity/light.js';
import light from '@parity/light.js-react';
import withHealth from '../utils/withHealth';
import i18n, { packageNS } from '../i18n';

@withHealth
@branch(
  ({
    health: {
      status: { good, syncing }
    }
  }) => good || syncing,
  /**
   * Only call light.js chainName$ if we're syncing or good
   * to avoid making an RPC call before the API is set
   * (since Health.js is always rendered).
   *
   * Reference: https://github.com/paritytech/fether/pull/483#discussion_r271303462
   */
  light({
    chainName: () => chainName$()
  })
)
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
    } else if (status.launching || status.syncing) {
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

    if (status.launching) {
      return i18n.t(`${packageNS}:health.status.title.launching`);
    } else if (!status.nodeConnected && !status.internet) {
      return i18n.t(
        `${packageNS}:health.status.title.no_internet_no_node_connected`
      );
    } else if (!status.nodeConnected && status.internet) {
      return i18n.t(
        `${packageNS}:health.status.title.internet_no_node_connected`
      );
    } else if (status.nodeConnected && !status.internet) {
      return i18n.t(
        `${packageNS}:health.status.title.no_internet_node_connected`
      );
    } else if (!status.clockSync) {
      return i18n.t(`${packageNS}:health.status.title.no_clock_sync`);
    } else if (!status.peers) {
      return i18n.t(`${packageNS}:health.status.title.no_peers`);
    } else if (status.syncing) {
      return `${i18n.t(`${packageNS}:health.status.title.syncing`)} ${
        payload &&
        payload.syncing &&
        payload.syncing.syncPercentage &&
        payload.syncing.syncPercentage.gt(0)
          ? ` (${payload.syncing.syncPercentage.toFixed(0)}%)`
          : ''
      } ${chainName}`;
    } else if (status.good) {
      return `${i18n.t(
        `${packageNS}:health.status.title.synced`
      )} ${chainName}`;
    } else {
      return JSON.stringify(payload) || ''; // Just in case payload is an object
    }
  };
}

export default Health;
