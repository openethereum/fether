// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import Health from '../Health';

class Settings extends PureComponent {
  render () {
    return (
      <div>
        <nav className='header-nav'>
          <Link to='/tokens'>test</Link>
        </nav>

        <div className='window_content'>
          <p>Settings page</p>
        </div>

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

export default Settings;
