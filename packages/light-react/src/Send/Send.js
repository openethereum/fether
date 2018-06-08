// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { defaultAccount$, myBalance$ } from '@parity/light.js';
import { map } from 'rxjs/operators';
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import light from 'light-hoc';
import { Link } from 'react-router-dom';

import ethereumIcon from '../assets/img/tokens/ethereum.png';

@light({
  balance: () => myBalance$().pipe(map(value => +fromWei(value))),
  me: defaultAccount$
})
class Send extends PureComponent {
  state = {
    amount: 0.01, // In Ether
    gas: 21000,
    to: '0x00Ae02834e91810B223E54ce3f9B7875258a1747'
  };

  handleChangeAmount = ({ target: { value } }) =>
    this.setState({ amount: value });

  handleChangeGas = ({ target: { value } }) => this.setState({ gas: value });

  handleChangeTo = ({ target: { value } }) => this.setState({ to: value });

  handleSubmit = e => {
    e.preventDefault();
    const { history, me } = this.props;
    const { amount, gas, to } = this.state;
    const tx = {
      from: me,
      gas,
      to,
      value: toWei(amount)
    };
    history.push(`/signer`, tx);
  };

  render () {
    const { balance } = this.props;
    const { amount, gas, to } = this.state;

    return (
      <div>
        <nav className='header-nav'>
          <div className='header-nav_left'>
            <Link to='/tokens' className='icon -close'>
              Close
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>Send Ethereum</h1>
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
                <form className='send-form' onSubmit={this.handleSubmit}>
                  <fieldset className='form_fields'>
                    <div className='form_field'>
                      <label>Amount</label>
                      <input
                        className='form_field_amount'
                        onChange={this.handleChangeAmount}
                        required
                        type='number'
                        value={amount}
                      />
                      <nav className='form-field_nav'>
                        <button className='button -utility'>Max</button>
                      </nav>
                    </div>
                    <div className='form_field'>
                      <label>To</label>
                      <textarea
                        className='-sm'
                        onChange={this.handleChangeTo}
                        required
                        type='text'
                        placeholder='Recipient address'
                        value={to}
                      />
                    </div>
                    <div className='form_field -range'>
                      <label>Gas</label>
                      <input
                        onChange={this.handleChangeGas}
                        required
                        min='1'
                        max='44000'
                        type='range'
                        value={gas}
                      />
                      <nav className='range-nav'>
                        <span className='range-nav_label'>Cheap</span>
                        <span className='range-nav_value'>{gas}</span>
                        <span className='range-nav_label'>Fast</span>
                      </nav>
                    </div>
                  </fieldset>
                  <nav className='form-nav'>
                    <button className='button'>Send</button>
                  </nav>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Send;
