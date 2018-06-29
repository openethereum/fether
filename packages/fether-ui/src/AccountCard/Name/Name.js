// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import Placeholder from '../../Placeholder';

const Name = ({ name, ...otherProps }) => (
  <div className='account_name' {...otherProps}>
    {name || <Placeholder height={18} width={100} />}
  </div>
);

Name.propTypes = {
  name: PropTypes.string
};

export default Name;
