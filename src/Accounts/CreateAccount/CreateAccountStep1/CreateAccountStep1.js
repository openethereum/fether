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
class CreateAccountStep1 extends Component {
  componentDidMount () {
    this.props.createAccountStore.generateNewAccount();
  }

  handleChangeIsImporting = ({ target: { checked } }) =>
    this.props.createAccountStore.setIsImporting(checked);

  handleChangeName = ({ target: { value } }) =>
    this.props.createAccountStore.setName(value);

  render () {
    const {
      createAccountStore: { address, generateNewAccount, isImporting, name }
    } = this.props;

    return (
      <div className='window_content'>
        {address &&
          <div className='box -padded'>
            <div className='box -card'>
              <CreateAccountHeader />
              <div className='box -card-drawer'>
                {!isImporting &&
                  <div className='box -pull-up text -right'>
                    <button
                      onClick={generateNewAccount}
                      className='button -tiny -reload'
                    >
                      Regenerate address
                    </button>
                  </div>}
                <div className='form_field'>
                  <label>Name</label>
                  <input
                    onChange={this.handleChangeName}
                    required
                    placeholder='Enter a name for this account'
                    value={name}
                  />
                </div>
                <label>
                  Import existing account<input
                    checked={isImporting}
                    onChange={this.handleChangeIsImporting}
                    type='checkbox'
                  />
                </label>
                <nav className='form-nav'>
                  {name
                    ? <Link to='/accounts/new/2'>
                      <button className='button'>Next</button>
                    </Link>
                    : <button className='button' disabled>
                        Next
                    </button>}
                </nav>
              </div>
            </div>
          </div>}
      </div>
    );
  }
}

export default CreateAccountStep1;
