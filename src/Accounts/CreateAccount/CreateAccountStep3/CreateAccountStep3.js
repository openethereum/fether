// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('createAccountStore')
@observer
class CreateAccountStep3 extends Component {
  state = {
    value: ''
  };

  handleChange = ({ target: { value } }) => this.setState({ value });

  render () {
    const { createAccountStore: { phrase } } = this.props;
    const { value } = this.state;

    return (
      <div>
        <div>
          Please rewrite your whole phrase here<br />
          <input onChange={this.handleChange} required value={value} />
        </div>
        {value === phrase &&
          <Link to='/accounts/new/step4'>
            <button>Next</button>
          </Link>}
      </div>
    );
  }
}

export default CreateAccountStep3;
