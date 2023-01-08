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
  console.log(result)
  expect(result).toEqual(`Métrique,Valeur,Informations complémentaires
EcoIndex,56/100,
Note,C,
GES,1.88eqCO2,Pour un total de 2000 visites par mois, ceci correspond à 42km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)
Eau,2.82cl,Pour un total de 2000 visites par mois, ceci correspond à 1 douche`);
  consoleLogMock.mockRestore();
});

test("should report with JSON", () => {
  const expected = JSON.stringify([
    {
      "label": "EcoIndex",
      "value": 56
    },
    {
      "label": "Note",
      "value": "C"
    },
    {
      "label": "GES",
      "value": 1.88,
      "unit": "gCO2e",
      "comment": "Pour un total de 2000 visites par mois, ceci correspond à 42km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)"
    },
    {
      "label": "Eau",
      "value": 2.82,
      "unit": "cl",
      "comment": "Pour un total de 2000 visites par mois, ceci correspond à 1 douche"
    }
  ]);

  const consoleLogMock = jest.spyOn(global.console, "log").mockImplementation();
  json(sampleAudit, { visits: 2000 });
  const result = consoleLogMock.mock.calls.join("\n");
  expect(JSON.stringify(JSON.parse(result))).toEqual(expected);
  consoleLogMock.mockRestore();
});
