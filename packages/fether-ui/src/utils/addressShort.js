// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

export const addressShort = address =>
  address ? `${address.slice(0, 6)}..${address.slice(-4)}` : '';
