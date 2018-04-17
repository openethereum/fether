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
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap
} from 'rxjs/operators';
import memoize from 'lodash/memoize';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { addSubscribedRpc } from '../../overview';
import api from '../../api';
import doOnSubscribe from '../../utils/doOnSubscribe';
import priotization from '../../priotization';

/**
 * Get all accounts managed by the light client.
 *
 * Calls eth_accounts.
 *
 * @returns {Observable<Array<String>>} - An Observable containing the list of accounts
 */
export const accounts$ = priotization.accounts$.pipe(
  switchMap(() => Observable.fromPromise(api.eth.accounts())),
  map(accounts => accounts.map(Api.util.toChecksumAddress)),
  doOnSubscribe(() => addSubscribedRpc('accounts$')),
  shareReplay(1)
);

/**
 * Get the balance of a given account.
 *
 * Calls eth_getBalance.
 *
 * @param {String} address - The account address to query the balance.
 * @returns {Observable<Number>} - An Observable containing the balance.
 */
export const balanceOf$ = memoize(address =>
  priotization.balanceOf$.pipe(
    switchMap(() => Observable.fromPromise(api.eth.getBalance(address))),
    map(_ => +_), // Return number instead of BigNumber
    doOnSubscribe(() => addSubscribedRpc('balanceOf$')),
    distinctUntilChanged(),
    shareReplay(1)
  )
);

/**
 * Get the default account managed by the light client.
 *
 * Fetches the first account in {@link accounts$}.
 */
export const defaultAccount$ = accounts$.pipe(
  map(accounts => accounts[0]),
  doOnSubscribe(() => addSubscribedRpc('balanceOf$')),
  distinctUntilChanged()
);

/**
 * Get the current block height.
 *
 * Calls parity_subscribe('eth_blockNumber').
 *
 * @returns {Observable<Number>} - An Observable containing the block height
 */
export const height$ = priotization.height$;

/**
 * Alias for {@link height$}
 */
export const blockNumber$ = height$;

/**
 * Alias for {@link defaultAccount$}
 */
export const me$ = defaultAccount$;
