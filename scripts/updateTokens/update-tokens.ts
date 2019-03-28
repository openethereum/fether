import { CommitStatus } from "./types/CommitStatus";
import { GitCommit } from "./types/GitCommit";
import { RawTokenJSON } from "./types/TokensJson";

import * as fs from "fs";
import * as https from "https";
import { networks, processTokenJson } from "./update-tokens-utils";
import * as path from "path";

const hardcoded_ipfs_files = {
  eth:
    "https://cloudflare-ipfs.com/ipfs/QmUJJpSQXWiKh6Jex6wLSZ1RWND8CxJu6XQMb7v2ByQhTR",
  kov:
    "https://cloudflare-ipfs.com/ipfs/QmZUXkAH69BpjJWcpND5HnQVsro6CXVxKiSX9vK49KsyZn",
  rop:
    "https://cloudflare-ipfs.com/ipfs/QmRAzyMEFNFFRqKTMcpk5qDdTpctgTDQU2PN8RPXSt5guj"
};

function httpsGet(opts: any): Promise<string> {
  return new Promise(resolve => {
    https.get(opts, (res: any) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (data: any) => (body += data));
      res.on("end", () => {
        resolve(body);
      });
    });
  });
}

function githubApi<T extends object>(pathTail: string): Promise<T> {
  return httpsGet({
    hostname: "api.github.com",
    path: `/repos/ethereum-lists/tokens${pathTail}`,
    headers: {
      "user-agent": "node",
      "content-type": "application/json; charset=utf-8"
    }
  }).then(body => JSON.parse(body));
}

async function getIPFSaddresses() {
  let useHardcodedAddresses = false;

  // parse the command line params passed to the script
  // if "--use-hardcoded-ipfs-addresses" was passed
  // we use the hardcoded ipfs files defined at the top
  // of this script
  process.argv.forEach(function(val, index, array) {
    if (val === "--use-hardcoded-ipfs-addresses") {
      useHardcodedAddresses = true;
    }
  });

  if (useHardcodedAddresses) {
    console.log(`Using hardcoded IPFS addresses...`);
    return hardcoded_ipfs_files;
  } else {
    // First we fetch the latest commit from ethereum-lists/tokens
    console.log("Fetching ethereum-lists/tokens commits...");
    const commits = await githubApi<GitCommit[]>("/commits");
    const commit = commits[0];

    // Then we fetch its build status
    console.log("Fetching commits statuses...");
    const statuses = await githubApi<CommitStatus[]>(`/statuses/${commit.sha}`);

    // Fetch the IPFS link, which is a page of links to other IPFS links
    console.log("Fetching IPFS output HTML...");
    const ipfsUrl = statuses.find(status => status.target_url.includes("ipfs"));
    if (!ipfsUrl) {
      throw Error("ipfs url not found");
    }
    const ipfsTargetUrl = ipfsUrl.target_url;
    const ipfsHtml = await httpsGet(ipfsTargetUrl);

    // Get the IPFS url for the each network tokens json. Regexxing HTML hurts, but w/e
    const ipfs_files = {};
    networks.forEach(async network => {
      console.log(`Fetching IPFS ${network.networkName} Tokens JSON...`);
      const regex = `<a href='([^']+)'>output\/full\/${
        network.networkNameIPFS
      }\.json<\/a>`;
      const tokenUrlMatch = ipfsHtml.match(regex);
      if (!tokenUrlMatch) {
        throw Error("No match found for token url");
      }
      ipfs_files[network.networkNameIPFS] = tokenUrlMatch[1];
    });
    return ipfs_files;
  }
}

async function run() {
  // get the list of file to use per network
  const ipfsAddresses = await getIPFSaddresses();
  console.log("Using the following addresses: ", ipfsAddresses);

  networks.forEach(async network => {
    if (!!ipfsAddresses[network.networkNameIPFS]) {
      const tokensUrl = ipfsAddresses[network.networkNameIPFS];
      const tokensJson: RawTokenJSON[] = JSON.parse(await httpsGet(tokensUrl));

      // Format the json to match our format in /packages/fether-react/src/assets/tokens/<network>.json
      const tokens = processTokenJson(tokensJson);
      // Write to the file
      console.log(
        `Writing Tokens JSON to /packages/fether-react/src/assets/tokens/${
          network.networkName
        }.json...`
      );
      const filePath = path.resolve(
        __dirname,
        `../../packages/fether-react/src/assets/tokens/${
          network.networkName
        }.json`
      );
      fs.writeFile(
        filePath,
        JSON.stringify(tokens, null, 2),
        "utf8",
        (err: any) => {
          if (err) {
            console.error(err);
            throw new Error(
              "Failed to write tokens json to file, see above error"
            );
          }
          console.log("Succesfully imported", tokens.length, "tokens!");
        }
      );
    } else {
      console.log(`No IPFS file found for ${network.networkName}!`);
    }
  });
}

run();
