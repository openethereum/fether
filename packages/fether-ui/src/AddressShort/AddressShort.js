// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

export const AddressShort = ({ address, as: T = 'span', ...otherProps }) => (
  <T {...otherProps}>
    {address.slice(0, 6)}
    ..
    {address.slice(-4)}
  </T>
);

AddressShort.propTypes = {
  address: PropTypes.string.isRequired
};
