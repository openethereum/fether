// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import EventEmitter from 'eventemitter3';
import net from 'net';

import Pino from '../utils/pino';

const pino = Pino();

/*
 * IpcChannel to send messages to and receive messages from the node via ipc.
 *
 * Usage:
 *  ipcChannel.init('path/to/ipc');
 *  ipcChannel.send('{"jsonrpc":"2.0", ...}')
 *  ipcChannel.on('message', x => { console.log(x) });
 */

class IpcChannel extends EventEmitter {
  _queued = [];

  init (path) {
    return new Promise((resolve, reject) => {
      pino.info('Connecting to IPC socket...');

      const socket = net.createConnection(path);
      socket.on('connect', () => {
        pino.info('Connected to IPC socket.');
        this._socket = socket;
        this._sendQueued();
        resolve(true);
      });

      // We get data from the socket by chunks, and 1 chunk !== 1 Rpc message
      // Sometimes 1 chunk is multiple messages, sometimes we get partial
      // messages.
      // https://github.com/paritytech/fether/issues/562

      // The last element in a '\n'-separate chunk. Will be `""` if the
      // last element was a correctly-formed message, or will hold the
      // ill-formed message otherwise.
      let lastData = '';
      socket.on('data', data_ => {
        // If the last data was truncated, then we concatenate to the new data
        // we just received
        const data = `${lastData}${data_.toString()}`;

        // All messages are separated by a '\n'
        const messages = data.split(/\n/);
        lastData = messages.pop(); // Will hold "" or an ill-formed JSONRPC message

        messages.forEach(data => {
          this.emit('message', data);
        });
      });
      socket.on('error', err => {
        pino.error('Error connecting to IPC socket.', err);
        reject(err);
      });
    });
  }

  send (message) {
    if (this._socket) this._socket.write(message + '\r\n');
    else this._queued.push(message);
  }

  _sendQueued () {
    this._queued.forEach(message => this.send(message));
  }
}

export default new IpcChannel();
