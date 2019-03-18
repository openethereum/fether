// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Placeholder } from '../../Placeholder';

const MAX_ACCOUNT_NAME_LENGTH = 25;

export const Name = ({ name, screen, ...otherProps }) => (
  <div
    className={`account_name ${screen === 'account' ? '-header' : ''}`}
    {...otherProps}
  >
    {name.length > MAX_ACCOUNT_NAME_LENGTH
      ? `${name.substring(0, MAX_ACCOUNT_NAME_LENGTH)}...`
      : name || <Placeholder height={14} width={100} />}
  </div>
);

Name.propTypes = {
  name: PropTypes.string,
  screen: PropTypes.string
};
