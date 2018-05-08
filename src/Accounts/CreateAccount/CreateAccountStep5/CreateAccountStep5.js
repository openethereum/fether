// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('createAccountStore')
@observer
class CreateAccountStep5 extends Component {
  handleSubmit = () => {
    const {
      createAccountStore: { saveAccountToParity },
      history
    } = this.props;
    saveAccountToParity().then(() => history.push('/settings'));
  };

  render () {
    const {
      createAccountStore: { hint }
    } = this.props;

    return (
      <div>
        <h3>Create account step 5</h3>
        <p>Confirm account creation?</p>
        <p>
          Password Hint: <em>{hint}</em>
        </p>
        <button onClick={this.handleSubmit}>Confirm</button>
      </div>
    );
  }
}

export default CreateAccountStep5;
