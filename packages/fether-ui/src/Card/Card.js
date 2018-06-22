// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className, drawers, onClick }) => (
  <div
    className={['box', '-card', onClick ? '-clickable' : '', className].join(
      ' '
    )}
    onClick={onClick}
  >
    {children}
    {drawers &&
      drawers.map(drawer => (
        <div className='box -card-drawer' key={drawer.key}>
          {drawer}
        </div>
      ))}
  </div>
);

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  drawers: PropTypes.arrayOf(PropTypes.node), // A card can have multiple drawers
  onClick: PropTypes.func
};

export default Card;
