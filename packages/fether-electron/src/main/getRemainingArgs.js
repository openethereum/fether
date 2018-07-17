const { Option } = require('commander');

export default cli =>
  cli.rawArgs
    .splice(Math.max(cli.rawArgs.findIndex(item => item.startsWith('-')), 0)) // Remove all arguments until one --option
    .filter((rawArg, index, rawArgs) => {
      // If the option is consumed by commander.js, then we skip it
      if (cli.options.find(o => o.is(rawArg))) {
        return false;
      }

      // If it's an argument of an option consumed by commander.js, then we
      // skip it too
      const previousRawArg = rawArgs[index - 1];
      if (previousRawArg) {
        const previousKey = new Option(previousRawArg).attributeName();
        if (cli[previousKey] === rawArg) {
          return false;
        }
      }

      return true;
    });
