// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';

const Placeholder = ({ height, width }) => (
  <ContentLoader
    className='placeholder'
    height={height}
    style={{ height, width }}
    width={width}
  >
    <rect x='0' y='0' rx='0' ry='0' height={height} width={width} />
  </ContentLoader>
);

Placeholder.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Placeholder;
