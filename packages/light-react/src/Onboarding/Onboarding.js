// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { FormField, Header } from 'light-ui';
import { inject, observer } from 'mobx-react';

import Health from '../Health';

@inject('onboardingStore')
@observer
class Onboarding extends Component {
  handleFirstRun = () => {
    // Not first run anymore after clicking Accept
    this.props.onboardingStore.setIsFirstRun(false);
  };

  render () {
    return (
      <div>
        <Header title={<h1>Terms of Use</h1>} />

        <div className='window_content'>
          <div className='box -padded'>
            <FormField
              input={
                <textarea
                  className='-xlg'
                  defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                  readOnly
                />
              }
              label="Please read carefully Fether Wallet's Terms of Use"
            />
          </div>
        </div>

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
            <button className='button' onClick={this.handleFirstRun}>
              Accept
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

export default Onboarding;
