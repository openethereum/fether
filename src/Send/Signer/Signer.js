// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { map } from 'rxjs/operators';
import { fromWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { defaultAccount$, myBalance$, post$ } from '@parity/light.js';

import ethereumIcon from '../../assets/img/tokens/ethereum.png';
import light from '../../hoc';

@inject('signerStore')
@observer

@light({
  balance: () => myBalance$().pipe(map(value => +fromWei(value))),
  me: defaultAccount$
})
class Signer extends Component {
  state = {
    password: '',
    status: null
  };

  componentWillMount () {
    // If we accessed this URL via URL change, then something's not right, so
    // we go back. If we accessed after the Send page, then location.state is
    // set as the tx.
    if (!this.props.location.state) {
      this.props.history.goBack();
    }
  }

  componentDidMount () {
    const tx = this.props.location.state;
    this.subscription = post$(tx).subscribe(status => {
      if (status.requested) {
        this.requestId = status.requested;
      }
      this.setState({ status });
    });
  }

  componentWillUnmount () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleAccept = () => {
    const { signerStore } = this.props;
    const { password } = this.state;
    signerStore.acceptRequest(this.requestId, password);
  };

  handleChangePassword = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  handleReject = () => {
    const { history, signerStore } = this.props;
    signerStore.rejectRequest(this.requestId).then(() => history.goBack());
  };

  handleSubmit = e => {
    e.preventDefault();
    this.handleAccept();
  };

  render () {
    const { balance, location: { state: tx } } = this.props;
    const { password, status } = this.state;

    return (

      <div>
        <nav className='header-nav'>
          <div className='header-nav_left'>
            <Link to='/send' className='icon -close'>
              Close
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>Sending Ethereum</h1>
          </div>
          <div className='header-nav_right' />
        </nav>

        <div className='window_content'>
          <div className='box -padded'>
            <div className='box -card'>
              <div className='token'>
                <div className='token_icon'>
                  <img src={ethereumIcon} alt='ethereum' />
                </div>
                <div className='token_name'>Ethereum</div>
                <div className='token_balance'>
                  {balance}
                  <span className='token_symbol'>ETH</span>
                </div>
              </div>
              <div className='box -card-drawer'>
                <div className='form_field'>
                  <label>Amount</label>
                  <div className='form_field_value'>
                    {+fromWei(tx.value)} ETH
                  </div>
                </div>
                <div className='form_field'>
                  <label>To</label>
                  <div className='form_field_value'>
                    {tx.to}
                  </div>
                </div>
              </div>
              <div className='box -card-drawer'>
                <div className='text'>
                  <p>Enter your password to confirm this transaction.</p>
                </div>
                <div className='form_field'>
                  <label>Password</label>
                  <input
                    onChange={this.handleChangePassword}
                    required
                    type='password'
                    value={password}
                  />
                </div>
                <nav className='form-nav -binary'>
                  <button
                    className='button -cancel'
                    onClick={this.handleReject}
                    type='button'
                  >
                    Cancel
                  </button>
                  <button
                    className='button -submit'
                  >
                    Confirm transaction
                  </button>{' '}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signer;
