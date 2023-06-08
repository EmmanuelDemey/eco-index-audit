const fs = require("fs");

module.exports = (result, options) => {
  if (!options.sonarFilePath) {
    console.error("You should define the sonarFilePath property");
    process.exit(1);
  }
  const issues = [];

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
    issues.push(sonar);
  }

  const generateMetricMessage = (name, value, status, recommandation) => {
    //`You ecoindex (${result.ecoIndex}) is below the configured threshold (${options.ecoIndex})`
    if (name === "number_requests") {
      return `The number of HTTP requests (${value}) is below the configured threshold (${recommandation})`;
    } else if (name === "page_size") {
      return `The size of the page (${value}) is below the configured threshold (${recommandation})`;
    } else if (name === "Page_complexity") {
      return `The complexity of the page (${value}) is below the configured threshold (${recommandation})`;
    }
  };
  result.pages?.forEach(({ url, metrics }) => {
    metrics?.forEach(({ name, value, status, recommandation }) => {
      if (status === "warning" || status === "error") {
        issues.push({
          engineId: "eco-index",
          ruleId: "eco-index-" + name.toLowerCase(),
          severity: status === "warning" ? "MINOR" : "MAJOR",
          type: "BUG",
          primaryLocation: {
            message:
              generateMetricMessage(name, value, status, recommandation) +
              ` (${url})`,
            filePath: options.sonarFilePath,
          },
        });
      }
    });
  });

  if (options.outputPathDir && issues.length > 0) {
    fs.mkdirSync(options.outputPathDir, { recursive: true });
    fs.writeFileSync(
      options.outputPathDir +
        "/" +
        (options.outputFileName ?? "report") +
        "-sonar.json",
      JSON.stringify({ issues })
    );
  }

  console.log(issues);
};
