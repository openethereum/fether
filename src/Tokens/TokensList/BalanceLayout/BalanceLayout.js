// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types';

const BalanceLayout = ({ balance, token }) => (
  <div className='token box -card -clickable'>
    <div className='token_icon'>
      <img alt={token.symbol} src={token.logo} />
    </div>
    <div className='token_name'>{token.name}</div>
    <div className='token_balance'>
      {Number.isFinite(balance) ? balance.toFixed(2) : '...'}{' '}
      <span className='token_symbol'>{token.symbol}</span>
    </div>
  </div>
);

BalanceLayout.propTypes = {
  balance: PropTypes.number
};

export default BalanceLayout;
