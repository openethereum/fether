// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({ className, input, label, ...otherProps }) => (
  <div className={['form_field', className].join(' ')}>
    <label>{label}</label>
    {input || <input {...otherProps} />}
  </div>
);

FormField.propTypes = {
  className: PropTypes.string,
  input: PropTypes.node,
  label: PropTypes.string
};

export default FormField;
