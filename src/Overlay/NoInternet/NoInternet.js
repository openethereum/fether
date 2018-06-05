// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';

class NoInternet extends PureComponent {
  render () {
    return (
      <div className='windowContent'>
        <div className='box -padded'>
          <div className='alert-screen'>
            <div className='alert-screen_content'>
              Poor connection detected. Please check your network.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NoInternet;
