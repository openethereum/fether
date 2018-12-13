// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '../Card';
import { Placeholder } from '../Placeholder';

// Concatenates a string balance value by an amount of characters after the decimal place
function concatBalanceByDecimalPlaces (value, decimals) {
  return value
    .split('.')
    .map((el, i) => (i === 1 ? el.slice(0, decimals) : el))
    .join('.');
}

export const TokenCard = ({
  balance,
  children,
  decimals,
  showBalance,
  token,
  ...otherProps
}) => (
  <Card {...otherProps}>
    <div className='token'>
      <div className='token_icon'>
        {token && token.logo ? (
          <img alt={token.symbol} src={token.logo} />
        ) : (
          <Placeholder height={20} width={20} />
        )}
      </div>
      <div className='token_name'>
        {token && token.name ? (
          token.name
        ) : (
          <Placeholder height={20} width={100} />
        )}
      </div>
      <div className='token_balance'>
        {balance ? (
          <span>
            {concatBalanceByDecimalPlaces(balance.toString(), decimals)}{' '}
          </span>
        ) : showBalance ? (
          <Placeholder height={20} width={50} />
        ) : null}
        <span className='token_symbol'>{token && token.symbol}</span>
      </div>
      {children}
    </div>
  </Card>
);

TokenCard.defaultProps = {
  decimals: 2,
  showBalance: true
};

TokenCard.propTypes = {
  decimals: PropTypes.number.isRequired,
  token: PropTypes.shape({
    logo: PropTypes.string,
    name: PropTypes.string,
    symbol: PropTypes.string
  })
};

export default TokenCard;
