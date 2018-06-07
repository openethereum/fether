// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { accounts$ } from '@parity/light.js';
import {
  BrowserRouter,
  MemoryRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Accounts from '../Accounts';
import light from '../hoc';
import Onboarding from '../Onboarding';
import Overlay from '../Overlay';
import Receive from '../Receive';
import Send from '../Send';
import Settings from '../Settings';
import Signer from '../Send/Signer';
import { STATUS } from '../stores/healthStore';
import Tokens from '../Tokens';
import './App.css';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

@light({
  accounts: accounts$
})
@inject('healthStore', 'firstRunStore')
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
      accounts,
      firstRunStore,
      healthStore: {
        health: { status }
      }
    } = this.props;
    const { isFirstRun } = firstRunStore;

    // We show the onboarding process if:
    // - either it's the 1st time the user runs this app
    // - or the user has 0 account
    const isOnboarding =
      // If either of the two is undefined, then it means we're still fetching.
      // This doesn't count as onboarding.
      accounts === undefined || isFirstRun === undefined
        ? false
        : isFirstRun || !accounts.length;

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
        <Route path='/signer' component={Signer} />
        <Route path='/tokens' component={Tokens} />
        <Redirect from='*' to='/' />
      </Switch>
    );
  }
}

export default App;
