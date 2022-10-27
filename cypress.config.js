const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        async checkEcoIndex(url){
          const check = require('./src/main')
          const response = await check({
            url: url,
            ecoIndex: 95
          }, true);
          return response
        }
    })
    },
  },
});
