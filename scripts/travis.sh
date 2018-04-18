#!/bin/bash
# Copyright 2015-2018 Parity Technologies (UK) Ltd.
# This file is part of Parity.

# SPDX-License-Identifier: MIT

set -e

echo "Running code checks & build"

npm run lint
npm run build
npm run test

exit 0
