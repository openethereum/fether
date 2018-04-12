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

import { Observable } from 'rxjs/Observable';
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

/**
 * Post a transaction to the network.
 *
 * Calls parity_postTransaction. Subsequently calls parity_checkRequest and
 * eth_getTransactionReceipt to get the status of the transaction.
 *
 * @param {Object} tx - A transaction object
 * @returns {Observable<>}
 */
export const post$ = tx =>
  Observable.create(async observer => {
    try {
      observer.next({ initialising: true });
      const signerRequestId = await api.parity.postTransaction(tx);
      observer.next({ requested: signerRequestId });
      const transactionHash = await api.pollMethod(
        'parity_checkRequest',
        signerRequestId
      );
      if (tx.condition) {
        observer.next({ signed: transactionHash, schedule: tx.condition });
      } else {
        observer.next({ signed: transactionHash });
        const receipt = await api.pollMethod(
          'eth_getTransactionReceipt',
          transactionHash,
          receipt =>
            receipt && receipt.blockNumber && !receipt.blockNumber.eq(0)
        );
        observer.next({ confirmed: receipt });
      }
      observer.complete();
    } catch (error) {
      observer.error({ failed: error });
    }
  });
