const { defineConfig } = require("cypress");
const { enableEcoIndexAuditForCypress } = require('./src/cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      enableEcoIndexAuditForCypress(on)
    },
  },
});
