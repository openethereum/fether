// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component, Suspense } from 'react';
import {
  BrowserRouter,
  MemoryRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import isElectron from 'is-electron';
import { Modal } from 'fether-ui';
import ReactResizeDetector from 'react-resize-detector';

import loading from '../assets/img/icons/loading.svg';

// Lazy load the following components, because they require light.js to be set
// before being defined. So we only load them once we have done `setApi()` from
// light.js (inside parityStore).
const Accounts = React.lazy(() => import('../Accounts'));
const BackupAccount = React.lazy(() => import('../BackupAccount'));
const Onboarding = React.lazy(() => import('../Onboarding'));
const Send = React.lazy(() => import('../Send'));
const Tokens = React.lazy(() => import('../Tokens'));
const Whitelist = React.lazy(() => import('../Whitelist'));

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;
const electron = isElectron() ? window.require('electron') : null;

@inject('onboardingStore', 'parityStore')
@observer
class App extends Component {
  handleResize = (_, height) => {
    if (!electron) {
      return;
    }
    // Send height to main process
    electron.ipcRenderer.send('asynchronous-message', 'app-resize', height);
  };

  /**
   * Decide which screen to render.
   */
  render () {
    const {
      parityStore: { isReady },
      onboardingStore: { isFirstRun }
    } = this.props;

    // Don't display child components requiring RPCs if API is not yet set
    if (!isReady) {
      return this.renderLoadingModal();
    }

    if (isFirstRun) {
      return (
        <Suspense fallback={this.renderLoadingModal()}>
          <div className='window'>
            <Onboarding />
          </div>
        </Suspense>
      );
    }

    return (
      <Suspense fallback={this.renderLoadingModal()}>
        <ReactResizeDetector handleHeight onResize={this.handleResize}>
          <div className='content'>
            <div className='window'>
              <Router>
                <Switch>
                  {/* The next line is the homepage */}
                  <Redirect exact from='/' to='/accounts' />
                  <Route
                    path='/accounts'
                    component={props => <Accounts {...props} />}
                  />
                  <Route
                    path='/onboarding'
                    component={props => <Onboarding {...props} />}
                  />
                  <Route
                    path='/tokens/:accountAddress'
                    component={props => <Tokens {...props} />}
                  />
                  <Route
                    path='/whitelist/:accountAddress'
                    component={props => <Whitelist {...props} />}
                  />
                  <Route
                    path='/backup/:accountAddress'
                    component={props => <BackupAccount {...props} />}
                  />
                  <Route
                    path='/send/:tokenAddress/from/:accountAddress'
                    component={props => <Send {...props} />}
                  />
                  <Redirect from='*' to='/' />
                </Switch>
              </Router>
            </div>
          </div>
        </ReactResizeDetector>
      </Suspense>
    );
  }

  renderLoadingModal = () => (
    <Modal
      description='Please wait a few instants'
      fullscreen
      loading={loading}
      title='Initialising...'
      visible
    />
  );
}

export default App;
