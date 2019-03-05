// https://vanity-service.parity.io/parity-binaries?version=stable&os=linux&architecture=x86_64
// https://vanity-service.parity.io/parity-binaries?version=beta&os=windows&architecture=x86_64
// https://vanity-service.parity.io/parity-binaries?version=beta&os=darwin&architecture=x86_64

const crypto = require('crypto');
const { chmod, existsSync, writeFile } = require('fs');
const download = require('download');
const fetch = require('node-fetch');
const { promisify } = require('util');
const semver = require('semver');

const {
  parity: { version: versionRequirement, channel: track }
} = require('../packages/fether-electron/package.json');

const exec = promisify(require('child_process').exec);
const fsChmod = promisify(chmod);
const fsWriteFile = promisify(writeFile);

let os;
switch (process.platform) {
  case 'win32':
    os = 'windows';
    break;
  case 'darwin':
    os = 'darwin';
    break;
  default:
    os = 'linux';
}

const ENDPOINT = `https://vanity-service.parity.io/parity-binaries?version=${track}&os=${os}&architecture=x86_64`;

const STATIC_DIRECTORY = '../packages/fether-electron/static/';

const foundPath = [
  `${STATIC_DIRECTORY}/parity`,
  `${STATIC_DIRECTORY}/parity.exe`
].find(existsSync);

if (foundPath) {
  // Bundled Parity was found, we check if the version matches the minimum requirements
  exec(`${foundPath} --version`)
    .then(({ stdout, stderr }) => {
      if (stderr) throw new Error(stderr);

      const version = stdout.match(/v\d+\.\d+\.\d+/)[0];
      if (!semver.satisfies(version, versionRequirement)) {
        console.log(
          'Bundled Parity Ethereum %s is older than required version %s',
          version,
          versionRequirement
        );
        return downloadParity();
      }
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
} else {
  // Bundled Parity wasn't found, we download the latest version
  downloadParity().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

function downloadParity () {
  return fetch(ENDPOINT)
    .then(r => r.json())
    .then(resp =>
      resp[0].files.find(({ name }) => ['parity', 'parity.exe'].includes(name))
    )
    .then(({ name, downloadUrl, checksum: expectedChecksum }) => {
      console.log('Downloading Parity Ethereum... (%s)', downloadUrl);

      return download(downloadUrl).then(data => {
        const actualChecksum = crypto
          .createHash('sha256')
          .update(data)
          .digest('hex');

        if (expectedChecksum !== actualChecksum) {
          throw new Error(
            `Parity Ethereum checksum mismatch: expecting ${expectedChecksum}, got ${actualChecksum}.`
          );
        }

        // Write to file and set a+x permissions
        const destinationPath = `${STATIC_DIRECTORY}/${name}`;
        return fsWriteFile(destinationPath, data).then(() =>
          fsChmod(destinationPath, 755)
        );
      });
    })
    .then(() => console.log('Success.'));
}
