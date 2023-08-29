---
title: Utilisation
---

## Installation

If you just need to run an audit, you can use NPX

```bash
npx @cnumr/eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=table

npx @cnumr/eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=csv

npx @cnumr/eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=json

npx @cnumr/eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=sonar --sonarFilePath=index.html --outputPathDir=./reports
```

But you can also clone, install and run the project locally.

```bash
git clone https://github.com/cnumr/eco-index-audit
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
      - run: npx @cnumr/eco-index-audit --url=https://www.google.com/ --ecoIndex=90 --output=table
```

## Integration with Sonar

Since the version _3.3.0_ the CLI can generate a external sonar report you can add to the Sonar configuration (via the `sonar.externalIssuesReportPaths` option).

You need to define the path to one of your file managed by Sonar, in order to make the rule visible in Sonar Cloud.

```shell
npx @cnumr/eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=sonar --sonarFilePath=index.html --outputPathDir=./reports
```


## Configure via the eco-index-audit.js file

You can also configure this module via a `eco-index-audit.js` configuration file. This file should be located in the root folder of your project.

```js
module.exports = {
  url: ["https://www.google.com/"],
  output: ["table"],
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
        index: "eco-index",
        document: results,
      });
    },
  ],
};
```

## Environment Variables

You can add environment variables in order to configure `eco-index-audit`:

- `ECOINDEX_VERBOSE`: if set to true, will log more information in the terminal.
- `ECOINDEX_DISPLAY_HTML`: if set to true, will log the HTML of the audited page.

```
ECOINDEX_VERBOSE=true npx eco-index-audit --url=https://www.google.com/ --ecoIndex=50 --visits=2000 --output=table
```

## Tests

Update snapshots with `npm test -- -u`

## Tech Stack

Typescript, Puppeteer, Cypress

## Resources

- [Eco Index Audit Cypress Plugin by Gleb Bahmutov](https://www.youtube.com/watch?v=pmuPVl7mdKI)

## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)

## Disclaimer

The LCA values used by [ecoindex_api](https://github.com/cnumr/ecoindex_api) to evaluate environmental impacts are not under free license - ©Frédéric Bordage
Please also refer to the mentions provided in the code files for specifics on the IP regime.
