const fs = require("fs");
const { dirname, resolve, join } = require("path");
const { cwd } = require("process");

module.exports = (result, options) => {
  //TODO add documentation to the README

  if (!options.sonarFilePath) {
    console.error("You should define the sonarFilePath property");
    process.exit(1);
  }
  if (!options.outputPath) {
    console.error("You should define the outputPath property");
    process.exit(1);
  }

  if (options.ecoIndex > result.ecoIndex) {
    const sonar = {
      engineId: "eco-index",
      ruleId: "eco-index-below-threshold",
      severity: "MAJOR",
      type: "BUG",
      primaryLocation: {
        message: `You ecoindex (${result.ecoIndex}) is below the configured threshold (${options.ecoIndex})`,
        filePath: options.sonarFilePath,
      },
    };

    const dir = dirname(resolve(cwd(), options.outputPath));
    fs.mkdirSync(dir, {recursive: true})
    fs.writeFileSync(join(dir, options.outputPath), JSON.stringify({issues: [sonar]}));
  }
};
