// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import BigNumber from 'bignumber.js';
import { combineLatest, Observable, fromEvent, merge } from 'rxjs';
import { compose, mapPropsStream } from 'recompose';
import isElectron from 'is-electron';
import {
  peerCount$ as _peerCount$,
  syncStatus$,
  withoutLoading
} from '@parity/light.js';
import { startWith, map, publishReplay } from 'rxjs/operators';

import parityStore from '../stores/parityStore';

const electron = isElectron() ? window.require('electron') : null;

// List here all possible states of our health store. Each state can have a
// payload.
export const STATUS = {
  CANTCONNECT: Symbol('CANTCONNECT'), // Can't connect to Parity's api
  CLOCKNOTSYNC: Symbol('CLOCKNOTSYNC'), // Local clock is not sync
  DOWNLOADING: Symbol('DOWNLOADING'), // Currently downloading Parity
  GOOD: Symbol('GOOD'), // Everything's fine
  NOINTERNET: Symbol('NOINTERNET'), // No Internet connection
  NOPEERS: Symbol('NOPEERS'), // Not connected to any peers
  RUNNING: Symbol('RUNNING'), // Parity is running (only checked at startup)
  SYNCING: Symbol('SYNCING') // Obvious
};

const isParityRunning$ = Observable.create(observer => {
  if (electron) {
    electron.ipcRenderer.on('parity-running', (_, isParityRunning) => {
      observer.next(isParityRunning);
    });
  }
}).pipe(
  startWith(electron ? !!electron.remote.getGlobal('isParityRunning') : false),
  // All the observables are publishReplay, otherwise combineLatest would stall
  // until the observable emits a value after the combineLatest subscription
  // (happens for withHealth components rendered later on)
  publishReplay(1)
);
isParityRunning$.connect();

const isApiConnected$ = parityStore.isApiConnected$.pipe(publishReplay(1));
isApiConnected$.connect();

const downloadProgress$ = Observable.create(observer => {
  if (electron) {
    electron.ipcRenderer.on('parity-download-progress', (_, progress) => {
      observer.next(progress);
    });
  }
}).pipe(
  startWith(0),
  publishReplay(1)
);
downloadProgress$.connect();

const isClockSync$ = Observable.create(observer => {
  if (electron) {
    electron.ipcRenderer.send('asynchronous-message', 'check-clock-sync');
    electron.ipcRenderer.once('check-clock-sync-reply', (_, clockSync) => {
      observer.next(clockSync.isClockSync);
    });
  }
}).pipe(
  startWith(true),
  publishReplay(1)
);
isClockSync$.connect();

const online$ = merge(
  fromEvent(window, 'online').pipe(map(() => true)),
  fromEvent(window, 'offline').pipe(map(() => false))
).pipe(
  startWith(navigator.onLine),
  publishReplay(1)
);
online$.connect();

const syncStatusWithPayload$ = syncStatus$().pipe(
  map(syncStatus => {
    if (!syncStatus) {
      return {
        isSync: true
      };
    }

    const { currentBlock, highestBlock, startingBlock } = syncStatus;
    const percentage = currentBlock
      .minus(startingBlock)
      .mul(100)
      .div(highestBlock.minus(startingBlock));

    return {
      isSync: false,
      syncPayload: {
        currentBlock,
        highestBlock,
        percentage,
        startingBlock
      }
    };
  }),
  publishReplay(1)
);
syncStatusWithPayload$.connect();

const peerCount$ = _peerCount$().pipe(
  withoutLoading(),
  publishReplay(1)
);
peerCount$.connect();

// Inject node health information as health.{status, payload} props
export default compose(
  mapPropsStream(props$ =>
    combineLatest(
      props$,
      isParityRunning$,
      isApiConnected$,
      downloadProgress$,
      syncStatusWithPayload$,
      isClockSync$,
      online$,
      peerCount$
    ).pipe(
      map(
        ([
          props,
          isParityRunning,
          isApiConnected,
          downloadProgress,
          { isSync, syncPayload },
          isClockSync,
          online,
          peerCount
        ]) => {
          // Parity is being downloaded
          if (downloadProgress > 0 && !isParityRunning) {
            return {
              ...props,
              health: {
                status: STATUS.DOWNLOADING,
                payload: {
                  percentage: new BigNumber(
                    Math.round(parityStore.downloadProgress * 100)
                  )
                }
              }
            };
          }

          // Parity is being launched
          if (isParityRunning && !isApiConnected) {
            return {
              ...props,
              health: {
                status: STATUS.RUNNING
              }
            };
          }

          // Not connected to the WS server
          if (!isApiConnected) {
            return {
              ...props,
              health: {
                status: STATUS.CANTCONNECT
              }
            };
          }

          // At this point we have a successful connection to parity

          // Syncing blocks
          if (!isSync) {
            return {
              ...props,
              health: {
                status: STATUS.SYNCING,
                payload: syncPayload
              }
            };
          }

          // Clock is not synchronized
          if (!isClockSync) {
            return {
              ...props,
              health: {
                status: STATUS.CLOCKNOTSYNC
              }
            };
          }

          // No connexion to the internet
          if (!online) {
            return {
              ...props,
              health: {
                status: STATUS.NOINTERNET
              }
            };
          }

          // Not enough peers
          if (peerCount && peerCount.lte(1)) {
            return {
              ...props,
              health: {
                status: STATUS.NOPEERS
              }
            };
          }

          // Everything's OK
          return {
            ...props,
            health: {
              status: STATUS.GOOD
            }
          };
        }
      )
    )
  )
);
