module.exports = {
  enableEcoIndexAuditForCypress: (on, options) => {
    // eslint-disable-next-line no-unused-vars
    on("before:browser:launch", (_browser = {}, launchOptions) => {
      const remoteDebuggingPort = launchOptions.args.find((config) => config.startsWith("--remote-debugging-port"));
      const remoteDebuggingAddress = launchOptions.args.find((config) =>
        config.startsWith("--remote-debugging-address")
      );
      if (remoteDebuggingPort) {
        global.remote_debugging_port = remoteDebuggingPort.split("=")[1];
      }
      if (remoteDebuggingAddress) {
        global.remote_debugging_address = remoteDebuggingAddress.split("=")[1];
      }
    });
    on("task", {
      async checkEcoIndex({url, overrideOptions, initialValues} = {}) {
        const check = require("./main");
        return await check(
          {
            ...options,
            ...overrideOptions,
            initialValues: initialValues ? {
              [url]: initialValues
            }: {},
            url: url,
            remote_debugging_port: global.remote_debugging_port,
            remote_debugging_address: global.remote_debugging_address,
          },
          true
        );
      },
    });
  },
};
