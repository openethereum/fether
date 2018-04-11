// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import { fromPromise } from 'rxjs/observable/fromPromise';
import { interval } from 'rxjs/observable/interval';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import api from '../../api';

/**
 * Get the name of the current chain.
 *
 * Calls parity_netChain once.
 *
 * @returns {Observable<String>} - An Observable containing the name of the current chain.
 */
export const chainName$ = fromPromise(api.parity.netChain());

/**
 * Get the status of the current chain.
 *
 * Calls parity_chainStatus every second.
 *
 * @returns {Observable<String>} - An Observable containing the status.
 */
export const chainStatus$ = interval(1000)
  .switchMap(() => fromPromise(api.parity.chainStatus()))
  .distinctUntilChanged();
