// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Header } from 'fether-ui';
import { Link } from 'react-router-dom';

import RequireHealthOverlay from '../RequireHealthOverlay';
import Health from '../Health';

class FlaggedPhraseRewrite extends Component {
  render () {
    const { history } = this.props;

    return (
      <RequireHealthOverlay require='sync'>
        <div>
          <Header
            left={
              <Link
                to='/tokens'
                className='icon -back'
                onClick={history.goBack}
              >
                Close
              </Link>
            }
            title={<h1>Account Recovery Phrase</h1>}
          />
          // Show the phrase // Show input to rewrite // Show button to confirm
          // Unflag account // Redirect to that account
          <nav className='footer-nav'>
            <div className='footer-nav_status'>
              <Health />
            </div>
          </nav>
        </div>
      </RequireHealthOverlay>
    );
  }
}

export default FlaggedPhraseRewrite;
