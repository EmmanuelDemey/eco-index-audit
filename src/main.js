const audit = require('./ecoindex/audit')
const reportResult = require('./reporter/table');

const grades = ["A", "B", "C", "D", "E", "F", "G"];

module.exports = async (options) => {
  console.log("audit")
  const result = await audit(options.url);
  const gradeInput = grades.findIndex((o) => o === options.grade);
  const gradeOutput = grades.findIndex((o) => o === result.grade);
console.log(result)
  reportResult(result);
  if (gradeInput !== -1 && gradeOutput > gradeInput) {
    console.error(`Your grade is ${gradeOutput}, but should be below ${gradeInput}`)
    return false
  }
  if (result.ecoIndex < options.ecoIndex) {
    console.error(`Your ecoIndex is ${result.ecoIndex}, but should be at least equal to ${options.ecoIndex}`)
    return false
  }
  return true
}