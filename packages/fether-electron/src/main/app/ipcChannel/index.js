// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const EventEmitter = require('eventemitter3');
const net = require('net');

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
      const socket = net.createConnection(path);
      socket.on('connect', () => {
        console.log('Connected to IPC socket.');
        this._socket = socket;
        this._sendQueued();
        resolve(true);
      });
      socket.on('data', data_ => {
        const data = data_.toString();
        console.log('Received a message from IPC socket', data);
        // Sometimes we receive multiple messages at once
        const messages = data.split(/\r?\n/).filter(Boolean);
        messages.forEach(data => {
          this.emit('message', data);
        });
      });
      socket.on('error', err => {
        console.log('Error connecting to IPC socket.', err);
        reject(new Error(err));
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
