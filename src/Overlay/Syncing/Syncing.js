// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import syncing from '../../assets/img/icons/loading.svg';

@inject('healthStore')
@observer
class Syncing extends Component {
  render () {
    const {
      healthStore: {
        health: { payload }
      }
    } = this.props;

    return (
      <div className='windowContent'>
        <div className='box -padded'>
          <div className='alert-screen'>
            <div className='alert-screen_content'>
              <div className='alert-screen_image'>
                <img src={syncing} />
              </div>
              <div className='alert-screen_text'>
                <h1>Syncing&hellip;</h1>
                <p>{ payload && payload.percentage ? ` (${payload.percentage}%)` : '' }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Syncing;
