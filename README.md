# Eco Index Audit

[![Actions Status](https://github.com/EmmanuelDemey/eco-index-audit/workflows/Build/badge.svg)](https://github.com/EmmanuelDemey/eco-index-audit/actions)

## Installation

If you just need to run an audit, you can use NPX

```bash
npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=table
```

But you can also clone, install and run the project locally.

```bash
git clone https://github.com/EmmanuelDemey/eco-index-audit
cd eco-index-audit
npm i
```

## Usage/Examples

```shell
node ./src/cli.js --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=table
node ./src/cli.js --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=csv
```

## CI Integration

You can execute this module directly from your CI. Here is an example for Github Actions :

```yaml
name: Running Eco Index via a Github Action

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm i -g eco-index-audit@0.6.0
      - run: npx eco-index-audit --url=https://www.google.com/ --ecoIndex=90 --output=table
```

## Integration with Cypress

For the moment, you can only use `eco-index-audit` inside a Cypress test suites running on a Chromium-based browser.

Before using `eco-index-audit` inside a Cypress test suite, you need to install and enable a new `devDependency`: `cypress-wait-until`. In order to install it inside your project, you need to execute the following command : 

```shell
npm i -D cypress-wait-until
```

Next, in order to enable it, you need to add the following import inside the `cypress/support/command.js` file. 

```js
import 'cypress-wait-until';
```

You are able to run this module during your Cypress test. The first step is to define a new task in the `cypress.config.js` file.

```js
const { defineConfig } = require("cypress");
const { enableEcoIndexAuditForCypress } = require('eco-index-audit/src/cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        async checkEcoIndex(url){
          enableEcoIndexAuditForCypress(on, {
              beforeScript: (globals) => {
                localStorage.setItem('authorisation', global.accessToken)
              },
              afterScript: (globals) => {
                localStorage.clear()
              },
              headless: false,
              globals: {
                accessToken: 'accessTokenValue'
              }
          })
        }
    })
    },
  },
});
```

If the `headless` parameter is set to false, the UI will opened with the Devtools enabled and will automatically stopped running everything after loading the page (using a debugger statement),

The `globals` object can be used if you need to share some data during the execution of the `beforeScript` and `afterScript` hooks. This object will be available as a parameter to these two hooks. 

Inside a Cypress test, `eco-index-audit` will reuse the same Chromium-based browser used by Cypress. 

And then use this task inside your test. Inside your test, you can check if the ecoIndex is below a threshold.

```js
describe('Cypress test', () => {
  const url = 'https://google.com'
  beforeEach(() => {
    cy.visit(url)
  })

  it('should have a good ecoindex', async () => {
    const threshold = 50
    cy.task("checkEcoIndex", url).its('ecoIndex').should('be.greaterThan', threshold);
  })
})
```

If you have interceptors inside your Cypress test, your eco-index will be better than expected. In order to be as closed as the reality, you can update the initial values of the metrics we used to. For example, if you intercept 4 HTTP requests of 1024 bytes

```js
describe('Cypress test', () => {
  const url = 'https://google.com'
  beforeEach(() => {
    cy.visit(url)
  })

  it('should have a good ecoindex', async () => {
    const threshold = 50
    cy.task("checkEcoIndex", url, {
      numberOfRequests: 4,
      sizeOfRequests: 4 * 1024
    }).its('ecoIndex').should('be.greaterThan', threshold);
  })
})
```


## Environment Variables

You can add environment variables in order to configure `eco-index-audit`: 

* `ECOINDEX_VERBOSE`: if set to true, will log more information in the terminal.
* `ECOINDEX_DISPLAY_HTML`: if set to true, will log the HTML of the audited page.  

```
ECOINDEX_VERBOSE=true npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=table
```

## Tests

Update snapshots with `npm test -- -u`

## Tech Stack

Typescript, Puppeteer

## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)
