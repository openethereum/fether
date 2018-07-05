// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import {
  BrowserRouter,
  MemoryRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Accounts from '../Accounts';
import Onboarding from '../Onboarding';
import Overlay from '../Overlay';
import Send from '../Send';
import { STATUS } from '../stores/healthStore';
import Tokens from '../Tokens';
import Whitelist from '../Whitelist';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

@inject('healthStore', 'onboardingStore')
@observer
class App extends Component {
  componentDidCatch () {
    if (process.env.NODE_ENV !== 'development') {
      // Redirect to '/' on errors
      window.location.href = '/';
    }
  }

  render () {
    return (
      <Router>
        <div className='wrapper'>
          <div className='content'>{this.renderScreen()}</div>
        </div>
      </Router>
    );
  }

  /**
   * Decide which screen to render.
   */
  renderScreen () {
    const {
      onboardingStore: { isFirstRun },
      healthStore: {
        health: { status }
      }
    } = this.props;

    if (isFirstRun) {
      return (
        <div className='window'>
          <Onboarding />
        </div>
      );
    }

    return (
      <div className='window'>
        {status !== STATUS.GOOD && <Overlay />}
        <Switch>
          {/* The next line is the hoempage */}
          <Redirect exact from='/' to='/tokens' />
          <Route path='/accounts' component={Accounts} />
          <Route path='/onboarding' component={Onboarding} />
          <Route path='/send' component={Send} />
          <Route path='/whitelist' component={Whitelist} />
          <Route path='/tokens' component={Tokens} />
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    );
  }
}

export default App;
