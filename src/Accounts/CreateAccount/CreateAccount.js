// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Step1 from './CreateAccountStep1';
import Step2 from './CreateAccountStep2';
import Step3 from './CreateAccountStep3';
import Step4 from './CreateAccountStep4';
import Step5 from './CreateAccountStep5';

class CreateAccount extends Component {
  render () {
    return (
      <div>
        <nav className='header-nav -modal'>
          <Link to='/' className='icon -close'>
            Close
          </Link>
          <p className='header_title'>Create a new account</p>
          <p>&nbsp;</p>
        </nav>

        <div className='window_content -modal'>
          <Route path='/accounts/new' component={Step1} />
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
