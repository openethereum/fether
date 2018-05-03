// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React from 'react';

const ETHER_IN_WEI = 1000000000000000000; // Is there a util function for this?

const BalanceLayout = ({ balance, image, name, symbol }) => (
  <div className='token box -card'>
    <div className='token_icon'>
      <img src={image} alt={name} />
    </div>
    <div className='token_name'>{name}</div>
    <div className='token_balance'>
      {balance ? (balance / ETHER_IN_WEI).toFixed(2) : '...'} {symbol}
    </div>
  </div>
);

export default BalanceLayout;
