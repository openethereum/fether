// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

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
import Receive from '../Receive';
import Send from '../Send';
import Settings from '../Settings';
import { STATUS } from '../stores/healthStore';
import Tokens from '../Tokens';
import './App.css';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

@inject('healthStore', 'onboardingStore')
@observer
class App extends Component {
  render () {
    return (
      <Router>
        <div className='wrapper'>
          <div className='content'>
            <div className='connector'>
              <svg width='60px' height='30px' viewBox='0 0 60 30'>
                <polygon points='0 30 60 30 30 0' />
              </svg>
            </div>
            <div className='window'>{this.renderScreen()}</div>
          </div>
        </div>
      </Router>
    );
  }

  /**
   * Decide which screen to render.
   */
  renderScreen () {
    const {
      onboardingStore: { isOnboarding },
      healthStore: {
        health: { status }
      }
    } = this.props;

    // If we are onboarding, then never show the Overlay. On the other hand, if
    // we're not onboarding, show the Overlay whenever we have an issue.
    if (!isOnboarding && status !== STATUS.GOOD) {
      return <Overlay />;
    }

    return (
      <Switch>
        {/* We redirect to Onboarding if necessary, or by default to our
        homepage which is Tokens */}
        <Redirect
          exact
          from='/'
          to={isOnboarding ? '/onboarding' : '/tokens'}
        />
        <Route path='/accounts' component={Accounts} />
        <Route path='/onboarding' component={Onboarding} />
        <Route path='/receive' component={Receive} />
        <Route path='/send' component={Send} />
        <Route path='/settings' component={Settings} />
        <Route path='/tokens' component={Tokens} />
        <Redirect from='*' to='/' />
      </Switch>
    );
  }
}

export default App;
