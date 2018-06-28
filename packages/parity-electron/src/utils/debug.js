// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import debug from 'debug';

import { name } from '../../package.json';

export default namespace => debug(`${name}:${namespace}`);
