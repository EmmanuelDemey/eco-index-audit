const audit = require("./ecoindex/audit");
const reportResult = require("./reporter/table");
const reportCsvResult = require("./reporter/csv");
const reportJsonResult = require("./reporter/json");
const reportSonarResult = require("./reporter/sonar");
const config = require("./config");

const grades = ["A", "B", "C", "D", "E", "F", "G"];

module.exports = async (options, withResult = false) => {
  const optionsWithDefault = {
    visits: config.TOTAL_VISITS,
    ...options,
  };

  const result = await audit(options.url, {
    beforeScript: options.beforeScript,
    afterScript: options.afterScript,
    headless: options.headless ?? true,
    globals: options.globals,
    remote_debugging_port: options.remote_debugging_port,
    remote_debugging_address: options.remote_debugging_address,
    initialValues: options.initialValues,
    beforeClosingPageTimeout: options.beforeClosingPageTimeout,
    waitForSelector: options.waitForSelector,
  });
  const gradeInput = grades.findIndex((o) => o === options.grade);
  const gradeOutput = grades.findIndex((o) => o === result.grade);

  options.output?.forEach((output) => {
    if (typeof output !== "string") {
      output(result, optionsWithDefault);
    } else if (output?.indexOf("csv") >= 0)
      reportCsvResult(result, optionsWithDefault);
    else if (output?.indexOf("json") >= 0)
      reportJsonResult(result, optionsWithDefault);
    else if (output?.indexOf("sonar") >= 0)
      reportSonarResult(result, optionsWithDefault);
    else if (
      output?.indexOf("table") >= 0 ||
      !options.output ||
      options.output?.length === 0
    )
      reportResult(result, optionsWithDefault);
  });

  if (gradeInput !== -1 && gradeOutput > gradeInput) {
    console.error(
      `Your grade is ${gradeOutput}, but should be below ${gradeInput}`
    );
    return false;
  }
  if (result.ecoIndex < options.ecoIndex) {
    const message = `Your ecoIndex is ${result.ecoIndex}, but should be at least equal to ${options.ecoIndex}`;
    console.error(message);
    return withResult ? { valid: false, ...result } : false;
  }
  return withResult ? { valid: true, ...result } : true;
};
