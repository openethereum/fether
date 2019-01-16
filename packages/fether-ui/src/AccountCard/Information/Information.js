// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';

import PropTypes from 'prop-types';

export const Information = ({
  children,
  screen,
  shortAddress,
  ...otherProps
}) => (
  <div
    className={`account_information ${
      screen === 'unlock' && !shortAddress ? '-narrow' : ''
    }`}
    {...otherProps}
  >
    {children}
  </div>
);

Information.propTypes = {
  children: PropTypes.node,
  screen: PropTypes.string,
  shortAddress: PropTypes.bool
};
