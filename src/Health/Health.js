// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

class Health extends Component {
  render () {
    return (
      <div className='status'>
        <span className='status_icon -syncing'>
          <svg viewBox='0 0 20 20'>
            <circle fill='#DDD' cx='10' cy='10' r='10' />
          </svg>
        </span>
        <span className='status_text'>Syncing... (4m)</span>
      </div>
    );
  }
}

export default Health;
