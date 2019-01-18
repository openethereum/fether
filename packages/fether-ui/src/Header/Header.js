// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Placeholder } from '../Placeholder';

export const Header = ({ left, right, screen, title }) => (
  <div className='header-nav'>
    <div className='header-nav header-nav_left'>{left}</div>
    <div className={`header-nav header-nav_title -header-${screen}`}>
      {title || <Placeholder height={24} width={150} />}
    </div>
    <div className='header-nav header-nav_right'>{right}</div>
  </div>
);

Header.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  screen: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};
