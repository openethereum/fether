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
import isElectron from 'is-electron';
import ReactResizeDetector from 'react-resize-detector';

import Accounts from '../Accounts';
import Onboarding from '../Onboarding';
import Overlay from '../Overlay';
import Send from '../Send';
import withHealth, { STATUS } from '../utils/withHealth';
import Tokens from '../Tokens';
import Whitelist from '../Whitelist';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;
const electron = isElectron() ? window.require('electron') : null;

@withHealth
@inject('onboardingStore')
@observer
class App extends Component {
  handleResize = (_, height) => {
    if (!electron) {
      return;
    }
    // Send height to main process
    electron.ipcRenderer.send('asynchronous-message', 'app-resize', height);
  };

  render () {
    return (
      <ReactResizeDetector handleHeight onResize={this.handleResize}>
        <Router>
          <div className='content'>{this.renderScreen()}</div>
        </Router>
      </ReactResizeDetector>
    );
  }

  /**
   * Decide which screen to render.
   */
  renderScreen () {
    const {
      onboardingStore: { isFirstRun },
      health: { status }
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
          {/* The next line is the homepage */}
          <Redirect exact from='/' to='/accounts' />
          <Route path='/accounts' component={Accounts} />
          <Route path='/onboarding' component={Onboarding} />
          <Route path='/tokens/:accountAddress' component={Tokens} />
          <Route path='/whitelist/:accountAddress' component={Whitelist} />
          <Route
            path='/send/:tokenAddress/from/:accountAddress'
            component={Send}
          />
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    );
  }
}

export default App;
