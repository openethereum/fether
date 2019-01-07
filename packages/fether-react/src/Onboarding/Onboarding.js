// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Form as FetherForm, Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import ReactMarkdown from 'react-markdown';

import Health from '../Health';
import termsAndConditions from './termsAndConditions.md';

/**
 * Options to pass into the renderer of ReactMarkdown
 */
const reactMarkdownOptions = {
  link: props => (
    <a href={props.href} target='_blank' rel='noopener noreferrer'>
      {props.children}
    </a>
  )
};

@inject('onboardingStore')
@observer
class Onboarding extends Component {
  state = {
    markdown: ''
  };

  componentWillMount () {
    window
      .fetch(termsAndConditions)
      .then(response => {
        return response.text();
      })
      .then(markdown => {
        this.setState({
          markdown
        });
      });
  }

  handleFirstRun = () => {
    // Not first run anymore after clicking Accept
    this.props.onboardingStore.setIsFirstRun(false);
  };

  render () {
    return (
      <div>
        <Header title={<h1>Terms of Use</h1>} />

        <div className='window_content'>
          <div className='box -padded-extra'>
            <div className='terms-and-conditions-wrapper'>
              <FetherForm.Field
                as={ReactMarkdown}
                className='terms-and-conditions'
                renderers={reactMarkdownOptions}
                source={this.state.markdown}
                label='Please read carefully'
              />
            </div>
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
