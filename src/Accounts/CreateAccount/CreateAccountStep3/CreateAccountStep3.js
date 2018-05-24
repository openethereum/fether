// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('createAccountStore')
@observer
class CreateAccountStep3 extends PureComponent {
  state = {
    value: ''
  };

  handleChange = ({ target: { value } }) => this.setState({ value });

  render () {
    const { createAccountStore: { phrase } } = this.props;
    const { value } = this.state;

    return (
      <div>
        <h3>Create account step 3</h3>
        <div>
          Please rewrite your whole phrase here<br />
          <input onChange={this.handleChange} required value={value} />
        </div>
        <em style={{ fontSize: 12 }}>
          @brian maybe tell the user to write the 3rd, 9th and 11th word only?
          3,9,11 being random numbers
        </em>
        {value === phrase &&
          <Link to='/accounts/new/step4'>
            <button>Done</button>
          </Link>}
      </div>
    );
  }
}

export default CreateAccountStep3;
