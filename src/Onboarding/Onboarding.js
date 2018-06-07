// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { accounts$ } from '@parity/light.js';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import Health from '../Health';
import light from '../hoc';

@light({
  accounts: accounts$
})
@inject('firstRunStore')
class Onboarding extends PureComponent {
  handleFirstRun = () => {
    // Not first run anymore after clicking Start
    this.props.firstRunStore.setIsFirstRun(false);
  };

  render () {
    const { accounts } = this.props;
    return (
      <div>
        This is the onboarding page.<br />
        {accounts && accounts.length ? (
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
