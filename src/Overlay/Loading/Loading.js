// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';

import loading from '../../assets/img/icons/loading.svg';

class Loading extends PureComponent {
  render () {
    return (
      <div className='windowContent'>
        <div className='box -padded'>
          <div className='alert-screen'>
            <div className='alert-screen_content'>
              <div className='alert-screen_image'>
                <img alt='loading' src={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
