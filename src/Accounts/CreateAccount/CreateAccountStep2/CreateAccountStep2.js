// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('createAccountStore')
@observer
class CreateAccountStep2 extends Component {
  render () {
    const {
      createAccountStore: { phrase }
    } = this.props;

    return (
      <div>
        <h3>Create account step 2</h3>
        <div>
          Please write your secret phrase on a piece of paper:<br />
          <pre>{phrase}</pre>
        </div>
        <Link to='/accounts/new/step3'>
          <button>Done</button>
        </Link>
      </div>
    );
  }
}

export default CreateAccountStep2;
