// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const Api = require('@parity/api');
const { bytesToHex } = require('@parity/api/lib/util');
const Contracts = require('@parity/contracts').default;
const fs = require('fs');

// A node serving a HTTP server needs to be running at the following port. The
// chain this script is fetching the tokens is the chain which this node
// connects to.
const api = new Api(new Api.Provider.Http('http://127.0.0.1:8545'));

const run = async () => {
  const { tokenReg, githubHint } = new Contracts(api);

  const chainName = await api.parity.netChain();
  console.log(`Fetching all tokens on ${chainName}, please wait...`);

  // Create file to write tokens to
  const filePath = `src/assets/tokens/${chainName}.json`;
  const wstream = fs.createWriteStream(filePath);

  // The JSON file will be an array, so we start by opening a bracket
  wstream.write('[\n');

  const tokenRegContract = await tokenReg.getContract();
  const githubHintContract = await githubHint.getContract();

  // Get tokenCount to loop through all tokens
  const tokenCount = +(await tokenRegContract.instance.tokenCount.call());
  for (let i = 0; i < tokenCount; i++) {
    // Get token information
    const token = await tokenRegContract.instance.token.call({}, [i]);

    // Some tokens are empty (unregistered), we skip them
    // token[0] is the token address
    if (+token[0] === 0) {
      continue;
    }

    // Get image hash of this token (stored inside the metadata)
    const imageHash = bytesToHex(
      await tokenRegContract.instance.meta.call({}, [i, 'IMG'])
    );
    // Variable result will contain the line to be added to our final JSON file
    const result = {
      address: token[0],
      decimals: token[2].e, // token[2] gives a BigNumber(100000000), the number of decimals is the exponent
      name: token[3],
      symbol: token[1]
    };

    // If there is an imageHash, then we fetch on GithubHint the url of that
    // image
    if (+imageHash !== 0) {
      const [logo] = await githubHintContract.instance.entries.call({}, [
        imageHash
      ]);
      result.logo = logo;
    }

    // Add this line to the buffer
    wstream.write(
      `${JSON.stringify(result)}${i === tokenCount - 1 ? '' : ','}\n`
    );
  }

  // Close the opening bracket, and then exit
  wstream.write(']', () => {
    wstream.close();

    // Finished, we can exit
    console.log(`Wrote ${tokenCount} tokens to ${filePath}.`);
    process.exit(0);
  });
};

run();
