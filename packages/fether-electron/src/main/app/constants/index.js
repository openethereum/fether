// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

// See trustworthiness of 127.0.0.1 vs localhost: https://letsencrypt.org/docs/certificates-for-localhost/
const TRUSTED_URLS = [
  'https://127.0.0.1:3000',
  'wss://127.0.0.1:8546',
  'https://parity.io',
  'https://github.com/paritytech/fether/issues/new',
  'https://api.github.com/repos/paritytech/fether/releases/latest'
];

export { TRUSTED_URLS };
