// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { STATUS } from '../stores/healthStore';

@inject('healthStore')
@observer
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
      healthStore: {
        health: { status }
      }
    } = this.props;
    switch (status) {
      case STATUS.GOOD:
        return '-good';
      case STATUS.DOWNLOADING:
      case STATUS.RUNNING:
      case STATUS.SYNCING:
        return '-syncing';
      default:
        return '-bad';
    }
  };

  statusToFriendlyMessage = () => {
    const {
      healthStore: {
        health: { status, payload }
      }
    } = this.props;
    switch (status) {
      case STATUS.CANTCONNECT:
        return "Can't connect to Parity";
      case STATUS.CLOCKNOTSYNC:
        return 'Clock not sync';
      case STATUS.DOWNLOADING:
        return `Downloading... (${payload.percentage}%)`;
      case STATUS.GOOD:
        return 'Synced';
      case STATUS.NOPEERS:
        return 'Not connected to any peers';
      case STATUS.RUNNING:
        return 'Running...';
      case STATUS.SYNCING:
        return `Syncing...${
          payload && payload.percentage && payload.percentage.gt(0)
            ? ` (${payload.percentage.toFixed(0)}%)`
            : ''
        }`;
      default:
        return JSON.stringify(payload); // Just in case payload is an object
    }
  };
}

export default Health;
