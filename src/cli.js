const check = require('./main');
const commandLineArgs = require("command-line-args");
const TOTAL_VISITS = 10000;

const optionDefinitions = [
  { name: "grade", alias: "g", type: String },
  { name: "ecoIndex", alias: "e", type: Number },
  { name: "url", type: String, multiple: true },
  { name: "visits", type: Number, defaultValue: TOTAL_VISITS },
  { name: "output", type: String }
];

(async () => {
  const options = commandLineArgs(optionDefinitions);

  const result = await check(options);
  if (!result) {
    process.exit(1);
  }
})();
