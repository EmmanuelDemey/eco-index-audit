const csv = require("./csv");
const json = require("./json");

const sampleAudit = {
  ecoIndex: 56,
  grade: "C",
  greenhouseGasesEmission: 1.88,
  waterConsumption: 2.82,
};

test("should report with CSV", () => {
  const consoleLogMock = jest.spyOn(global.console, "log").mockImplementation();
  csv(sampleAudit, { visits: 2000 });
  const result = consoleLogMock.mock.calls.join("\n");
  expect(result).toMatchSnapshot();
  consoleLogMock.mockRestore();
});

test("should report with JSON", () => {
  const consoleLogMock = jest.spyOn(global.console, "log").mockImplementation();
  json(sampleAudit, { visits: 2000 });
  const result = consoleLogMock.mock.calls.join("\n");
  expect(result).toMatchSnapshot();
  consoleLogMock.mockRestore();
});

