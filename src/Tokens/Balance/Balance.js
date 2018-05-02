// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import ethereumIcon from '../../assets/img/tokens/ethereum.png';

class Balance extends Component {
  render () {
    return (
      <div className='token box -card'>
        <div className='token_icon'>
          <img src={ethereumIcon} alt='ethereum' />
        </div>
        <div className='token_name'>Ethereum</div>
        <div className='token_balance'>42.89</div>
      </div>
    );
  }
}

export default Balance;
