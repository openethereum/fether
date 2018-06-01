// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';

import CreateAccountHeader from '../CreateAccountHeader';

@inject('createAccountStore')
@observer
class CreateAccountStep2 extends Component {
  render () {
    const { createAccountStore: { isImporting, phrase } } = this.props;

    // There's not Step2 if we are importing an existing account
    if (isImporting) {
      return <Redirect to='/accounts/new/3' />;
    }

    return (
      <div className='window_content'>
        <div className='box -padded'>
          <div className='box -card'>
            <CreateAccountHeader />
            <div className='box -card-drawer'>
              <div className='text'>
                <p>Please write your secret phrase on a piece of paper:</p>
              </div>
              <div className='text -code'>
                {phrase}
              </div>
              <nav className='form-nav'>
                <Link to='/accounts/new/3'>
                  <button className='button'>Next</button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccountStep2;
