// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '../Card';
import { Placeholder } from '../Placeholder';

export const TokenCard = ({
  balance,
  children,
  decimals,
  defaultTokenImage,
  showBalance,
  token,
  ...otherProps
}) => (
  <Card {...otherProps}>
    <div className='token'>
      <div className='token_icon'>
        <img
          alt={token.symbol}
          src={
            (!!token.logo && token.logo) ||
            `https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/32%402x/color/${token.symbol.toLowerCase()}%402x.png`
          }
          onError={ev => {
            ev.target.onerror = null;
            ev.target.src = defaultTokenImage;
          }}
        />
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
          <span>{balance.toFixed(decimals, 1)} </span>
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
  defaultTokenImage: PropTypes.string,
  token: PropTypes.shape({
    name: PropTypes.string,
    symbol: PropTypes.string
  })
};

export default TokenCard;
