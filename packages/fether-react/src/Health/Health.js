// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { branch } from 'recompose';
import { chainName$, withoutLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import withHealth from '../utils/withHealth';
import i18n from '../i18n';

@withHealth
@branch(
  ({
    health: {
      status: { good, syncing }
    }
  }) => good || syncing,
  // Only call light.js chainName$ if we're syncing or good
  light({
    chainName: () => chainName$().pipe(withoutLoading())
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

    if (status.downloading) {
      return `${i18n.t('ns1:health.status.title.downloading')} (${
        payload.downloading.syncPercentage
      }%)`;
    } else if (status.launching) {
      return i18n.t('ns1:health.status.title.launching');
    } else if (!status.nodeConnected && !status.internet) {
      return i18n.t('ns1:health.status.title.no_internet_no_node_connected');
    } else if (!status.nodeConnected && status.internet) {
      return i18n.t('ns1:health.status.title.internet_no_node_connected');
    } else if (status.nodeConnected && !status.internet) {
      return i18n.t('ns1:health.status.title.no_internet_node_connected');
    } else if (!status.clockSync) {
      return i18n.t('ns1:health.status.title.no_clock_sync');
    } else if (!status.peers) {
      return i18n.t('ns1:health.status.title.no_peers');
    } else if (status.syncing) {
      return `${i18n.t('ns1:health.status.title.syncing')} ${
        payload &&
        payload.syncing &&
        payload.syncing.syncPercentage &&
        payload.syncing.syncPercentage.gt(0)
          ? ` (${payload.syncing.syncPercentage.toFixed(0)}%)`
          : ''
      } ${chainName}`;
    } else if (status.good) {
      return `${i18n.t('ns1:health.status.title.synced')} ${chainName}`;
    } else {
      return JSON.stringify(payload) || ''; // Just in case payload is an object
    }
  };
}

export default Health;
