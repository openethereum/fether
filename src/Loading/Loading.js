// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import loading from '../assets/img/icons/loading.svg'
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';

import Health from '../Health';

@inject('parityStore')
@observer
class Loading extends Component {
  render () {
    const { parityStore: { isApiConnected } } = this.props;

    if (isApiConnected) {
      return <Redirect to='/' />;
    }

    return (
      <div className='windowContent'>
        <div className='box -padded'>
          <div className='alert-screen'>
            <div className='alert-screen_content'>
              <div className='alert-screen_image'>
                <img src={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
