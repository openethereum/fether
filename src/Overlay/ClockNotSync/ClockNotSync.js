// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';

class ClockNotSync extends PureComponent {
  render () {
    return (
      <div className='windowContent'>
        <div className='box -padded'>
          <div className='alert-screen'>
            <div className='alert-screen_content'>
              Your time is not sync.
              <br />
              Mac: System Preferences -> Date &amp; Time -> Uncheck and recheck
              "Set date and time automatically"
              <br />
              Windows: Control Panel -> "Clock, Language, and Region" -> "Date
              and Time" -> Uncheck and recheck "Set date and time automatically"
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ClockNotSync;
