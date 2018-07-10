// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

export type CliObject = {
  rawArgs?: string[];
  [key: string]: string | boolean | string[];
};

export type LoggerFunction = (namespace: string) => (log: string) => void;

export type Options = {
  cli: CliObject;
  logger: LoggerFunction;
};
