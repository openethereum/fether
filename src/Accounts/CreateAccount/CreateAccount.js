// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { Link, Route } from 'react-router-dom';

import Step1 from './CreateAccountStep1';
import Step2 from './CreateAccountStep2';
import Step3 from './CreateAccountStep3';
import Step4 from './CreateAccountStep4';
import Step5 from './CreateAccountStep5';

// Put in in array for programmatic indexing
const Steps = [Step1, Step2, Step3, Step4, Step5];

class CreateAccount extends PureComponent {
  render () {
    const { match: { params: { step } } } = this.props;
    return (
      <div>
        <nav className='header-nav -modal'>
          <div className='header-nav_left'>
            <Link to='/accounts' className='icon -close'>
              Close
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>Create a new account</h1>
          </div>
          <div className='header-nav_right'>
            <div className='progress-indicator'>
              {Steps.map((_, index) =>
                <div
                  className={[
                    'progress-indicator_step',
                    step > index ? '-complete' : ''
                  ].join(' ')}
                  key={`progress-indicator_step${index + 1}`}
                />
              )}
            </div>
          </div>
        </nav>

        <div className='window_content -modal'>
          {Steps.map((StepComponent, index) =>
            <Route
              component={StepComponent}
              key={`Step${index + 1}`}
              path={`/accounts/new/${index + 1}`}
            />
          )}
        </div>
      </div>
    );
  }
}

export default CreateAccount;
