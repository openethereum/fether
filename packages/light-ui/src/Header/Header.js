// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ left, right, title }) => (
  <div className='header-nav'>
    <div className='header-nav_left'>{left}</div>
    <div className='header-nav_title'>{title}</div>
    <div className='header-nav_right'>{right}</div>
  </div>
);

Header.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

export default Header;
