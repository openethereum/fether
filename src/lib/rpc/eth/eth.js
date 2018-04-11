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

import Api from '@parity/api';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import api from '../../api';

/**
 * Get all accounts managed by the light client.
 *
 * Calls eth_accounts.
 *
 * @returns {Observable<Array>} - An Observable containing the list of accounts
 */
export const accounts$ = fromPromise(api.eth.accounts()).map(accounts =>
  accounts.map(Api.util.toChecksumAddress)
);

/**
 * Get the balance of a given account.
 *
 * Calls eth_getBalance on every new {@link height$} event.
 *
 * @param {String} address - The account address to query the balance.
 * @returns {Observable<Number>} - An Observable containing the balance.
 */
export const balanceOf$ = address =>
  height$
    .switchMap(() => fromPromise(api.eth.getBalance(address)))
    .map(_ => +_) // Return number instead of BigNumber
    .distinctUntilChanged();

/**
 * Get the default account managed by the light client.
 *
 * Fetches the first account in {@link accounts$}.
 */
export const defaultAccount$ = accounts$
  .map(accounts => accounts[0])
  .distinctUntilChanged();

/**
 * Get the current block height.
 *
 * Calls parity_subscribe('eth_blockNumber').
 *
 * @returns {Observable<Number>} - An Observable containing the block height
 */
export const height$ = Observable.create(observer => {
  api.pubsub.eth.blockNumber((error, result) => {
    if (error) {
      observer.error(error);
    } else {
      observer.next(+result);
    }
  });
}).distinctUntilChanged();

/**
 * Alias for {@link height$}
 */
export const blockNumber$ = height$;

/**
 * Alias for {@link defaultAccount$}
 */
export const me$ = defaultAccount$;
