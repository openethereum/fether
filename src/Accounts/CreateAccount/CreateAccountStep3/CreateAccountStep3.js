// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import CreateAccountHeader from '../CreateAccountHeader';

@inject('createAccountStore')
@observer
class CreateAccountStep3 extends Component {
  state = {
    value: ''
  };

  handleChange = ({ target: { value } }) => this.setState({ value });

  handleSavePhrase = () => {
    const { createAccountStore: { setPhrase }, history } = this.props;
    const { value } = this.state;
    setPhrase(value).then(() => history.push('/accounts/new/4'));
  };

  render () {
    const { value } = this.state;

    return (
      <div className='window_content'>
        <div className='box -padded'>
          <div className='box -card'>
            <CreateAccountHeader />
            <div className='box -card-drawer'>
              <div className='text'>
                <p>Please write your recovery phrase here:</p>
              </div>
              <div className='form_field'>
                <label>Recovery phrase</label>
                <input onChange={this.handleChange} required value={value} />
              </div>

              <nav className='form-nav'>
                {this.renderButton()}
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderButton = () => {
    const { createAccountStore: { isImporting, phrase } } = this.props;
    const { value } = this.state;

    // If we are creating a new account, the button just checks the phrase has
    // been correctly written by the user.
    if (!isImporting) {
      return value === phrase
        ? <Link to='/accounts/new/4'>
          <button className='button'>Next</button>
        </Link>
        : <button className='button' disabled>
            Next
        </button>;
    }

    // If we are importing an existing account, the button sets the phrase
    return (
      <button className='button' onClick={this.handleSavePhrase}>
        Next
      </button>
    );
  };
}

export default CreateAccountStep3;
