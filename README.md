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

npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=sonar --sonarFilePath=index.html --outputPathDir=./reports
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

## Integration with Sonar

Since the version *3.3.0* the CLI can generate a external sonar report you can add to the Sonar configuration (via the `sonar.externalIssuesReportPaths` option).

You need to define the path to one of your file managed by Sonar, in order to make the rule visible in Sonar Cloud. 

```shell
npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=sonar --sonarFilePath=index.html --outputPathDir=./reports
```

## Integration with Cypress

For the moment, you can only use `eco-index-audit` inside a Cypress test suites running on a Chromium-based browser.

```shell
npx cypress run -b chrome
```

You are able to run this module during your Cypress test. The first step is to define a new task in the `cypress.config.js` file.

```js
const { defineConfig } = require("cypress");
const { prepareAudit, checkEcoIndex } = require("eco-index-audit/src/cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("before:browser:launch", (_browser, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        checkEcoIndex: ({ url, options }) => checkEcoIndex({ 
          url, 
          options: {
            headless: false,
            globals: { data: 'data'},
            beforeScript: (globals) => console.log(globals),
            afterScript: (globals) => console.log(globals),
          } 
        }),
      });
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

You can also define the `outputPathDir` option in order to save the result in a file. These properties are only use for the `json` and `csv` formats.

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
      options: {
        output: "json",
        outputPathDir
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
      options: {
        beforeClosingPageTimeout: 10000
      }
    }).its('ecoIndex', { timeout: 0 }).should('be.greaterThan', threshold);
  })
})
```

## Configure via the eco-index-audit.js file

You can also configure this module via a `eco-index-audit.js` configuration file. This file should be located in the root folder of your project. 

```js
module.exports = {
  url: ["https://www.google.com/"],
  output: [
    "table"
  ]
};

```

Thanks to this file, you can enable dynamic output in order to archive results into any external service. In the following snippet, we will sotre the result into Elasticsearch. 

```js
module.exports = {
  url: ["https://www.google.com/"],
  output: [
    "table",
    (results) => {
      const { Client } = require("@elastic/elasticsearch");
      const client = new Client({
        cloud: {
          id: "...",
        },
        auth: {
          username: "...",
          password: "...",
        },
      });
      client.index({
        index: 'eco-index',
        document: results
      })
    },
  ],
};

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

Typescript, Puppeteer, Cypress

## Resources 

* [Eco Index Audit Cypress Plugin by Gleb Bahmutov](https://www.youtube.com/watch?v=pmuPVl7mdKI)

## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)

## Disclaimer

The LCA values used by [ecoindex_api](https://github.com/cnumr/ecoindex_api) to evaluate environmental impacts are not under free license - ©Frédéric Bordage
Please also refer to the mentions provided in the code files for specifics on the IP regime.
