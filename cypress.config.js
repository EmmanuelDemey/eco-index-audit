const { defineConfig } = require("cypress");
const { prepareAudit, checkEcoIndex } = require("./src/cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("before:browser:launch", (_browser, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        checkEcoIndex: ({ url, options }) => checkEcoIndex({ url, options }),
      });
    },
  },
});
