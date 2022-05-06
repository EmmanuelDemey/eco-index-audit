
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


## Tech Stack

Typescript, Puppeteer


## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)

  
