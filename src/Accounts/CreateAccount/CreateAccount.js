// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { Route, Link } from 'react-router-dom';

import Step1 from './CreateAccountStep1';
import Step2 from './CreateAccountStep2';
import Step3 from './CreateAccountStep3';
import Step4 from './CreateAccountStep4';
import Step5 from './CreateAccountStep5';

class CreateAccount extends PureComponent {
  render () {
    return (
      <div>
        <nav className='header-nav -modal'>
          <div className='header-nav_left'>
            <Link to='/accounts' className='icon -close'>
              Close
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>
              Create a new account
            </h1>
          </div>
          <div className='header-nav_right'>
            <div className='progress-indicator'>
              <div className='progress-indicator_step -complete' />
              <div className='progress-indicator_step -complete' />
              <div className='progress-indicator_step' />
              <div className='progress-indicator_step' />
              <div className='progress-indicator_step' />
            </div>
          </div>
        </nav>

        <div className='window_content -modal'>
          <Route path='/accounts/new/step1' component={Step1} />
          <Route path='/accounts/new/step2' component={Step2} />
          <Route path='/accounts/new/step3' component={Step3} />
          <Route path='/accounts/new/step4' component={Step4} />
          <Route path='/accounts/new/step5' component={Step5} />
        </div>
      </div>
    );
  }
}

export default CreateAccount;
