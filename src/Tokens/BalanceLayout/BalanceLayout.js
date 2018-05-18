// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';

const BalanceLayout = ({ balance, logo, name, symbol }) =>
  <div className='token box -card -clickable'>
    <div className='token_icon'>
      <img alt={symbol} src={logo} />
    </div>
    <div className='token_name'>
      {name}
    </div>
    <div className='token_balance'>
      {Number.isFinite(balance) ? balance.toFixed(2) : '...'}{' '}
      <span className='token_symbol'>{symbol}</span>
    </div>
  </div>;

export default BalanceLayout;
