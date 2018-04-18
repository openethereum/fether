// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import Api from '@parity/api';

const defaultOptions = {
  provider: new Api.Provider.Ws('ws://localhost:8546')
};

const api = new Api(defaultOptions.provider);

export default api;
