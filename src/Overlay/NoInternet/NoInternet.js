// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import alert from '../../assets/img/icons/loading.svg';

class NoInternet extends PureComponent {
  render () {
    return (
      <div className='windowContent'>
        <div className='box -padded'>
          <div className='alert-screen'>
            <div className='alert-screen_content'>
              <div className='alert-screen_image'>
                <img src={alert} />
              </div>
              <div className='alert-screen_text'>
                <h1>Poor connection</h1>
                <p>Please check that your network.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NoInternet;
