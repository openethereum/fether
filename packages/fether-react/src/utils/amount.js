// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import BigNumber from 'bignumber.js';

const afterDot = value => value.substring(value.indexOf('.'));

const isAmountDecimalPlacesMoreThanTokenDecimalPlaces = (amountBn, token) =>
  amountBn.dp() > token.decimals &&
  smallestDenominationForToken(token).gte(amountBn.toString());

const smallestDenominationForToken = token =>
  new BigNumber((10 ** -token.decimals).toString());

const significantDigits = value =>
  withoutTrailingZeros(withoutLeadingZeros(afterDot(value.toString())));

const withoutLeadingZeros = value => value.replace(/^0+(\d)|(\d)0+$/gm, '$1$2');

const withoutTrailingZeros = value => value.replace(/^[0|\D]*/, '');

export {
  afterDot,
  isAmountDecimalPlacesMoreThanTokenDecimalPlaces,
  smallestDenominationForToken,
  significantDigits,
  withoutLeadingZeros,
  withoutTrailingZeros
};
