// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Step1 from './CreateAccountStep1';
import Step2 from './CreateAccountStep2';
import Step3 from './CreateAccountStep3';
import Step4 from './CreateAccountStep4';
import Step5 from './CreateAccountStep5';

class CreateAccount extends Component {
  render () {
    return (
      <div>
        <Route path='/accounts/new' component={Step1} />
        <Route path='/accounts/new/step2' component={Step2} />
        <Route path='/accounts/new/step3' component={Step3} />
        <Route path='/accounts/new/step4' component={Step4} />
        <Route path='/accounts/new/step5' component={Step5} />
      </div>
    );
  }
}

export default CreateAccount;
