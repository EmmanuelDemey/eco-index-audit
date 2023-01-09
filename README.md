# Eco Index Audit

[![Actions Status](https://github.com/EmmanuelDemey/eco-index-audit/workflows/Build/badge.svg)](https://github.com/EmmanuelDemey/eco-index-audit/actions)
[![npm version](https://badge.fury.io/js/eco-index-audit.svg)](https://badge.fury.io/js/eco-index-audit)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EmmanuelDemey_eco-index-audit&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EmmanuelDemey_eco-index-audit)

This tool is the CLI version of [this website](https://www.ecoindex.fr/)

## Installation

If you just need to run an audit, you can use NPX

```bash
npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=table

npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=csv

npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=json
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
node ./src/cli.js --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=json
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
      - run: npm i -g eco-index-audit
      - run: npx eco-index-audit --url=https://www.google.com/ --ecoIndex=90 --output=table
```

## Integration with Cypress

For the moment, you can only use `eco-index-audit` inside a Cypress test suites running on a Chromium-based browser.

```shell
npx cypress run -b chrome
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

  it('should have a good ecoindex', () => {
    const threshold = 50
    cy.task("checkEcoIndex", { url }).its('ecoIndex', { timeout: 0 }).should('be.greaterThan', threshold);
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

  it('should have a good ecoindex', () => {
    const threshold = 50
    cy.task("checkEcoIndex", {
      url,
      initialValues: {
        numberOfRequests: 4,
        sizeOfRequests: 4 * 1024
      }
    }).its('ecoIndex', { timeout: 0 }).should('be.greaterThan', threshold);
  })
})
```

You can also define the `outputPathDir` and `outputPath` options in order to save the result in a file. These properties are only use for the `json` and `csv` formats.

```js
const path = require('path');

describe('Cypress test', () => {
  const url = 'https://google.com'
  beforeEach(() => {
    cy.visit(url)
  })

  const outputPathDir = path.join(__dirname, 'reports');

  it('should have a good ecoindex', () => {
    const threshold = 50
    cy.task("checkEcoIndex", {
      url,
      overrideOptions: {
        output: "json",
        outputPathDir,
        outputPath: path.join(outputPathDir, "result.json"),
      }
    }).its('ecoIndex', { timeout: 0 }).should('be.greaterThan', threshold);
  })
})
```

You can also add a `timeout` before closing the Puppeteer page in order to debug the page thank to the `beforeClosingPageTimeout` options. The value is in `ms`

```js
describe('Cypress test', () => {
  const url = 'https://google.com'
  beforeEach(() => {
    cy.visit(url)
  })

  it('should have a good ecoindex', () => {
    const threshold = 50
    cy.task("checkEcoIndex", {
      url,
      overrideOptions: {
        beforeClosingPageTimeout: 10000
      }
    }).its('ecoIndex', { timeout: 0 }).should('be.greaterThan', threshold);
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

## Resources 

* [Eco Index Audit Cypress Plugin by Gleb Bahmutov](https://www.youtube.com/watch?v=pmuPVl7mdKI)

## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)
