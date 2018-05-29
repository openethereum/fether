// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
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
      <div>
        <p>
          This is the Loading page.<br />
        </p>

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
            <Link to='/settings' className='icon -settings'>
              Settings
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Loading;
