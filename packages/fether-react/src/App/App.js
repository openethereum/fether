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
import { Modal } from 'fether-ui';
import semver from 'semver';
import { version } from '../../package.json';

import Accounts from '../Accounts';
import BackupAccount from '../BackupAccount';
import Onboarding from '../Onboarding';
import BackupPhrase from '../BackupPhrase';
import RequireHealthOverlay from '../RequireHealthOverlay';
import Send from '../Send';
import Tokens from '../Tokens';
import Whitelist from '../Whitelist';

const currentVersion = version;

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

const electron = isElectron() ? window.require('electron') : null;

@inject('onboardingStore', 'parityStore')
@observer
class App extends Component {
  state = {
    newRelease: false // false | {name, url, ignore}
  };

  componentDidMount () {
    window.addEventListener('contextmenu', this.handleRightClick);

    window
      .fetch('https://api.github.com/repos/paritytech/fether/releases/latest')
      .then(j => j.json())
      .then(({ name, html_url: url, tag_name: tag }) => {
        const latestVersion = tag.match(/v(\d+\.\d+(\.\d+)?)/)[1];
        if (semver.gt(latestVersion, currentVersion)) {
          this.setState({
            newRelease: {
              name,
              url,
              ignore: false
            }
          });
        }
      })
      .catch(e => {
        console.error('Error while checking for a new version of Fether:', e);
      });
  }

  componentDidUnmount () {
    window.removeEventListener('contextmenu', this.handleRightClick);
  }

  renderModalLinks = () => {
    return (
      <nav className='form-nav -binary'>
        <button className='button -back' onClick={this.hideNewReleaseModal}>
          Remind me later
        </button>

        <button className='button' onClick={this.openNewReleaseUrl}>
          Download
        </button>
      </nav>
    );
  };

  hideNewReleaseModal = () => {
    this.setState({
      newRelease: { ...this.state.newRelease, ignore: true }
    });
  };

  openNewReleaseUrl = () => {
    window.open(this.state.newRelease.url, '_blank', 'noopener noreferrer');
  };

  handleRightClick = () => {
    if (!electron) {
      return;
    }
    electron.ipcRenderer.send('asynchronous-message', 'app-right-click');
  };

  /**
   * Decide which screen to render.
   */
  render () {
    const {
      onboardingStore: { isFirstRun },
      parityStore: { api }
    } = this.props;

    const { newRelease } = this.state;

    if (isFirstRun) {
      return (
        <div className='window'>
          <Onboarding />
        </div>
      );
    }

    // The child components make use of light.js and light.js needs to be passed
    // an API first, otherwise it will throw an error.
    // We set parityStore.api right after we set the API for light.js, so we
    // verify here that parityStore.api is defined, and if not we don't render
    // the children, just a <RequireHealthOverlay />.
    if (!api) {
      return (
        <RequireHealthOverlay fullscreen require='node'>
          {/* Adding these components to have minimum height on window */}
          <div className='content'>
            <div className='window' />
          </div>
        </RequireHealthOverlay>
      );
    }

    return (
      <div className='content'>
        <div className='window'>
          <Modal
            title='New version available'
            description={newRelease ? `${newRelease.name} was released!` : ''}
            visible={newRelease && !newRelease.ignore}
            buttons={this.renderModalLinks()}
          >
            <Router>
              <Switch>
                {/* The next line is the homepage */}
                <Redirect exact from='/' to='/accounts' />
                <Route path='/accounts' component={Accounts} />
                <Route path='/onboarding' component={Onboarding} />
                <Route path='/tokens/:accountAddress' component={Tokens} />
                <Route
                  path='/whitelist/:accountAddress'
                  component={Whitelist}
                />
                <Route
                  path='/backup/:accountAddress'
                  component={BackupAccount}
                />
                <Route
                  path='/backupPhrase/:accountAddress/:needsRewrite'
                  component={BackupPhrase}
                />
                <Route
                  path='/send/:tokenAddress/from/:accountAddress'
                  component={Send}
                />
                <Redirect from='*' to='/' />
              </Switch>
            </Router>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
