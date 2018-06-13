// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types';

import Card from '../Card';
import Placeholder from '../Placeholder';

const TokenCard = ({ balance, decimals, token, ...otherProps }) => (
  <Card {...otherProps}>
    <div className='token'>
      <div className='token_icon'>
        {token.logo ? (
          <img alt={token.symbol} src={token.logo} />
        ) : (
          <Placeholder height={20} width={20} />
        )}
      </div>
      <div className='token_name'>
        {token.name ? token.name : <Placeholder height={20} width={100} />}
      </div>
      <div className='token_balance'>
        {Number.isFinite(balance) ? (
          <span>
            {balance.toFixed(decimals)}{' '}
            <span className='token_symbol'>{token.symbol}</span>
          </span>
        ) : (
          <Placeholder height={20} width={80} />
        )}
      </div>
    </div>
  </Card>
);

TokenCard.defaultProps = {
  decimals: 2
};

TokenCard.propTypes = {
  balance: PropTypes.number,
  decimals: PropTypes.number.isRequired,
  token: PropTypes.shape({
    logo: PropTypes.string,
    name: PropTypes.string,
    symbol: PropTypes.string
  }).isRequired
};

export default TokenCard;
