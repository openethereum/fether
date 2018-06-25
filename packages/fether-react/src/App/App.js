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
import Settings from '../Settings';
import { STATUS } from '../stores/healthStore';
import Tokens from '../Tokens';

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
            <div className='connector -top'>
              <svg width='60px' height='30px' viewBox='0 0 60 30'>
                <polygon points='0 30 60 30 30 0' />
              </svg>
            </div>
            {this.renderScreen()}
            {/* <div className="connector -bottom">
              <svg width="60px" height="30px" viewBox="0 0 60 30">
                <polygon points="0 0 60 0 30 30" />
              </svg>
            </div> */}
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
          <Route path='/settings' component={Settings} />
          <Route path='/tokens' component={Tokens} />
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    );
  }
}

export default App;
