// https://vanity-service.parity.io/parity-binaries?version=stable&os=linux&architecture=x86_64
// https://vanity-service.parity.io/parity-binaries?version=beta&os=windows&architecture=x86_64
// https://vanity-service.parity.io/parity-binaries?version=beta&os=darwin&architecture=x86_64

const { chmod, existsSync, writeFile } = require('fs');
const crypto = require('crypto');
const download = require('download');
const fetch = require('node-fetch');
const path = require('path');
const { promisify } = require('util');
const semver = require('semver');

const {
  parity: { version: versionRequirement }
} = require('../packages/fether-electron/package.json');

const exec = promisify(require('child_process').exec);
const fsChmod = promisify(chmod);
const fsWriteFile = promisify(writeFile);

function getOs () {
  if (process.argv.includes('--win')) {
    return 'windows';
  }
  if (process.argv.includes('--mac')) {
    return 'darwin';
  }
  if (process.argv.includes('--linux')) {
    return 'linux';
  }

  switch (process.platform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'darwin';
    default:
      return 'linux';
  }
}

const ENDPOINT = `https://vanity-service.parity.io/parity-binaries?os=${getOs()}&architecture=x86_64`;

const STATIC_DIRECTORY = path.join(
  '..',
  'packages',
  'fether-electron',
  'static'
);

const foundPath = [
  path.join(STATIC_DIRECTORY, 'parity'),
  path.join(STATIC_DIRECTORY, 'parity.exe')
].find(existsSync);

if (foundPath) {
  // Bundled Parity was found, we check if the version matches the minimum requirements
  getBinaryVersion(foundPath)
    .then(version => {
      if (!version) {
        console.log("Couldn't get bundled Parity Ethereum version.");
        return downloadParity();
      }

      if (!semver.satisfies(version, versionRequirement)) {
        console.log(
          'Bundled Parity Ethereum %s is older than required version %s',
          version,
          versionRequirement
        );
        return downloadParity();
      } else {
        console.log(
          'Bundled Parity Ethereum %s matches required version %s',
          version,
          versionRequirement
        );
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
  return (
    fetch(ENDPOINT)
      .then(r => r.json())
      // Find the latest version matching the version requirement
      //
      // We use this method rather than downloading the latest beta, because if
      // somebody checks out a year-old commit, then the latest beta of Parity would
      // be downloaded, which would most likely not be compatible with the version
      // requirement (e.g. ~2.4.1)
      .then(resp => {
        const latestCompatibleItem = resp
          .filter(({ version }) => semver.valid(version))
          .reduce(
            (bestItem, item) =>
              semver.gt(item.version, bestItem.version) &&
              semver.satisfies(item.version, versionRequirement)
                ? item
                : bestItem,
            { version: '0.0.0' }
          );

        if (latestCompatibleItem.version === '0.0.0') {
          throw new Error(
            `Couldn't find a Parity Ethereum version compatible with ${versionRequirement}`
          );
        }

        return latestCompatibleItem;
      })
      .then(({ files, version }) => ({
        ...files.find(({ name }) => ['parity', 'parity.exe'].includes(name)),
        version
      }))
      .then(({ name, downloadUrl, checksum: expectedChecksum, version }) => {
        console.log(
          'Downloading Parity Ethereum %s... (%s)',
          version,
          downloadUrl
        );

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
          const destinationPath = path.join(STATIC_DIRECTORY, name);

          return fsWriteFile(destinationPath, data)
            .then(() => fsChmod(destinationPath, 0o755)) // https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback
            .then(() => destinationPath);
        });
      })
      .then(getBinaryVersion)
      .then(bundledVersion =>
        console.log(
          `Success: bundled Parity Ethereum ${bundledVersion ||
            "(couldn't get version)"}`
        )
      )
  );
}

function getBinaryVersion (binaryPath) {
  return exec(`${binaryPath} --version`)
    .then(({ stdout, stderr }) => {
      if (stderr) throw new Error(stderr);
      return stdout.match(/v\d+\.\d+\.\d+/)[0];
    })
    .catch(error => console.warn(error.message));
}
