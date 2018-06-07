// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import Health from '../Health';

@inject('onboardingStore')
@observer
class Onboarding extends Component {
  handleFirstRun = () => {
    // Not first run anymore after clicking Start
    this.props.onboardingStore.setIsFirstRun(false);
  };

  render () {
    const {
      onboardingStore: { hasAccounts }
    } = this.props;
    return (
      <div>
        This is the onboarding page.<br />
        {hasAccounts ? (
          <Link onClick={this.handleFirstRun} to='/'>
            Start
          </Link>
        ) : (
          <Link to='/accounts/new'>Create account</Link>
        )}
        <Health />
      </div>
    );
  }
}

export default Onboarding;
