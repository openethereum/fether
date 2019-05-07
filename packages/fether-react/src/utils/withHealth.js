// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { combineLatest, interval, fromEvent, merge } from 'rxjs';
import { compose, mapPropsStream } from 'recompose';
import {
  audit,
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  startWith,
  switchMap,
  take
} from 'rxjs/operators';
import isEqual from 'lodash/isEqual';
import { peerCount$, syncStatus$ } from '@parity/light.js';

import parityStore from '../stores/parityStore';
import * as postMessage from '../utils/postMessage';

const isApiConnected$ = parityStore.isApiConnected$;

postMessage.send('CHECK_CLOCK_SYNC_REQUEST');
const isClockSync$ = postMessage
  .listen$('CHECK_CLOCK_SYNC_RESPONSE')
  .pipe(startWith(true));

const online$ = merge(
  fromEvent(window, 'online').pipe(map(() => true)),
  fromEvent(window, 'offline').pipe(map(() => false))
).pipe(startWith(navigator.onLine));

const combined$ = combineLatest(isApiConnected$, online$, isClockSync$).pipe(
  publishReplay(1)
);
combined$.connect();

// Subscribe to the RPCs only once we set a provider
const rpcs$ = isApiConnected$.pipe(
  filter(isApiConnected => isApiConnected),
  take(1),
  switchMap(() =>
    combineLatest(
      syncStatus$()
        .pipe(
          map(syncStatus => {
            if (!syncStatus) {
              return {
                isSync: true
              };
            }

            const { currentBlock, highestBlock, startingBlock } = syncStatus;
            const syncPercentage = currentBlock
              .minus(startingBlock)
              .multipliedBy(100)
              .div(highestBlock.minus(startingBlock));

            return {
              isSync: false,
              syncPayload: {
                currentBlock,
                highestBlock,
                syncPercentage,
                startingBlock
              }
            };
          })
          // Emit "not synced" only if we haven't been synced for over 2 seconds
        )
        .pipe(audit(syncStatus => interval(syncStatus.isSync ? 0 : 2000))),
      peerCount$()
    )
  ),
  startWith([{ isSync: false }, undefined]), // Don't stall the HOC's combineLatest; emit immediately
  publishReplay(1)
);
rpcs$.connect();

// Inject node health information as health.{status, payload} props
export default compose(
  mapPropsStream(props$ =>
    combineLatest(props$, combined$, rpcs$).pipe(
      map(
        ([
          props,
          [isApiConnected, online, isClockSync],
          [{ isSync, syncPayload }, peerCount]
        ]) => {
          const isNoPeers =
            isApiConnected && (peerCount === undefined || peerCount.lte(1));
          const isGood =
            isSync && !isNoPeers && isClockSync && isApiConnected && online;

          // Status - list of all states of health store
          const status = {
            internet: online, // Internet connection
            nodeConnected: isApiConnected, // Connected to local Parity Ethereum node
            clockSync: isClockSync, // Local clock is not synchronised
            launching: !isApiConnected, // Launching Parity Ethereum only upon startup
            peers: !isNoPeers, // Connecion to peer nodes
            syncing: isApiConnected && !isSync, // Synchronising blocks
            good: isGood // Synchronised and no issues
          };

          // Payload - optional payload of a state
          const payload = {
            syncing: syncPayload
          };

          return {
            ...props,
            health: {
              status,
              payload
            }
          };
        }
      ),
      distinctUntilChanged(isEqual) // Perform deep comparison
    )
  )
);
