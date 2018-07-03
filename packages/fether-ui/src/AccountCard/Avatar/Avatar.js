// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import Blockies from 'react-blockies';
import PropTypes from 'prop-types';

import { Placeholder } from '../../Placeholder';

const Avatar = ({ address, ...otherProps }) => (
  <div className='account_avatar' {...otherProps}>
    {address ? (
      <Blockies seed={address.toLowerCase()} />
    ) : (
      <Placeholder height={36} width={36} />
    )}
  </div>
);

Avatar.propTypes = {
  address: PropTypes.string
};

export default Avatar;
