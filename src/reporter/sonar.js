const fs = require("fs");

module.exports = (result, options) => {
  if (!options.sonarFilePath) {
    console.error("You should define the sonarFilePath property");
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

    if(options.outputPathDir){
      fs.mkdirSync(options.outputPathDir, { recursive: true });
      fs.writeFileSync(options.outputPathDir + "/" + (options.outputFileName ?? "report") + "-sonar.json", JSON.stringify({issues: [sonar]}));
    }

    console.log(sonar);

  }
};
