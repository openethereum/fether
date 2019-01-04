// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

// Remove trailing zeros from end of big number decimal string
export const removeTrailingZeros = val => {
  // Early exit if non-decimal
  if (val.indexOf('.') === -1) {
    return val;
  }

  // Splits at decimal point.
  const splitVal = val.split('.');
  let startVal = '';
  let endVal = '';

  // Append decimal at end of startVal ready to prepend
  startVal = `${splitVal[0]}.`;
  endVal = splitVal[1];

  // Temporarily reverse endVal to find and remove trailing 0's
  // then reverse it back again as a newEndVal
  const reversedEndVal = endVal.split('').reverse();
  const indexFirstNonZero = reversedEndVal.findIndex(val => val !== '0');
  const reversedNewEndVal = reversedEndVal.slice(indexFirstNonZero);
  const newEndVal = reversedNewEndVal.reverse().join('');

  // Join startVal with newEndVal
  return startVal.concat(newEndVal);
};
