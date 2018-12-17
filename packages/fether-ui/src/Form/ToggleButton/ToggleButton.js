// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { Button } from 'semantic-ui-react';

export const ToggleButton = ({ label, ...otherProps }) => (
  <Button {...otherProps}>{label}</Button>
);
