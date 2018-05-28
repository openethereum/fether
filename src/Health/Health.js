// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { STATUS_BAD, STATUS_OK, STATUS_WARN } from '../stores/healthStore';

@inject('healthStore')
@observer
class Health extends Component {
  render () {
    const { healthStore: { averageHealth: { message } } } = this.props;
    return (
      <div className='status'>
        <span className={['status_icon', this.statusToClassName()].join(' ')}>
          <svg viewBox='0 0 20 20'>
            <circle fill='#DDD' cx='10' cy='10' r='10' />
          </svg>
        </span>
        <span className='status_text'>
          {message && message.join('. ')}
        </span>
      </div>
    );
  }

  statusToClassName = () => {
    const { healthStore: { averageHealth: { status } } } = this.props;
    switch (status) {
      case STATUS_OK:
        return '-good';
      case STATUS_WARN:
        return '-syncing';
      case STATUS_BAD:
      default:
        return '-bad';
    }
  };
}

export default Health;
