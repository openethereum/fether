// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Placeholder } from '../../Placeholder';

export const Name = ({ name, screen, ...otherProps }) => (
  <div
    className={`account_name ${screen !== 'accounts' ? '-header' : ''}`}
    {...otherProps}
  >
    {(screen === 'accounts'
      ? `${name.substring(0, 8)}...`
      : name.length > 25
        ? `${name.substring(0, 25)}...`
        : name) || <Placeholder height={18} width={100} />}
  </div>
);

Name.propTypes = {
  name: PropTypes.string,
  screen: PropTypes.string
};
