const audit = require("./ecoindex/audit")
const reportResult = require("./reporter/table")
const reportCsvResult = require("./reporter/csv")
const reportJsonResult = require("./reporter/json")

const grades = ["A", "B", "C", "D", "E", "F", "G"];

module.exports = async (options, withResult = false) => {
  
  const result = await audit(options.url, options.beforeScript);
  const gradeInput = grades.findIndex((o) => o === options.grade);
  const gradeOutput = grades.findIndex((o) => o === result.grade);
  if (options.output === "csv") reportCsvResult(result, options);
  if (options.output === "json") reportJsonResult(result, options);
  if (options.output === "table" || !options.output) reportResult(result, options);

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
