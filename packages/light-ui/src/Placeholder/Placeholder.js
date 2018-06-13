// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';

const Placeholder = ({ height, width }) => (
  <ContentLoader style={{ height, width }}>
    <rect x='0' y='0' rx='0' ry='0' height='100%' width='100%' />
  </ContentLoader>
);

Placeholder.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Placeholder;
