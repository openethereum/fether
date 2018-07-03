// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

export const FormField = ({
  className,
  input: inputComponent,
  label,
  ...otherProps
}) => (
  <div className={['form_field', className].join(' ')}>
    <label>{label}</label>
    {inputComponent || <input {...otherProps} />}
  </div>
);

FormField.propTypes = {
  className: PropTypes.string,
  input: PropTypes.node,
  label: PropTypes.string
};
