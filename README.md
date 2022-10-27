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

You are able to run this module during your Cypress test. The first step is to define a new task in the `cypress.config.js` file.

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        async checkEcoIndex(url){
          const check = require('eco-index-audit/src/main')
          const response = await check({
            url
          }, true);
          return response
        }
    })
    },
  },
});
```

And then use this task inside your test. Inside your test, you can check if the ecoIndex is below a threshold.

```js
describe('Cypress test', () => {
  const url = 'https://google.com'
  beforeEach(() => {
    cy.visit(url)
  })

  it('should have a good ecoindex', async () => {
    cy.task("checkEcoIndex", url)
      .its('ecoIndex')
      .should('be.greaterThan', 60);
  })
})
```

## Tests

Update snapshots with `npm test -- -u`

## Tech Stack

Typescript, Puppeteer

## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)
