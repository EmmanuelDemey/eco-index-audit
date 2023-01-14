const csv = require("./csv");
const json = require("./json");

const sampleAudit = {
  ecoIndex: 56,
  grade: "C",
  greenhouseGasesEmission: 1.88,
  waterConsumption: 2.82,
  pages: [
    {
      url: "url",
      ecoIndex: 56,
      grade: "C",
      greenhouseGasesEmission: 1.88,
      waterConsumption: 2.82,
      metrics: [
        {
          name: "number_requests",
          value: 16,
          status: "info",
          recommandation: "< 30 requests",
        },
        {
          name: "page_size_kbytes",
          value: 1200,
          status: "warning",
          recommandation: "< 1000kb",
        },
        {
          name: "Page_complexity",
          value: 3000,
          status: "error",
          recommandation: "Between 300 and 500 nodes",
        },
      ],
    },
  ],
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
  const expected = JSON.stringify({
    score: 56,
    grade: "C",
    estimatation_co2: {
      comment:
        "Pour un total de 2000 visites par mois, ceci correspond à 42km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)",
      commentDetails: { numberOfVisit: 2000, value_km: 42, value: 42, unit: 'km' },
    },
    estimatation_water: {
      comment: "Pour un total de 2000 visites par mois, ceci correspond à 1 douche",
      commentDetails: { numberOfVisit: 2000, value_shower: 1, value: 1, unit: 'douches' },
    },
    pages: [
      {
        url: "url",
        ecoIndex: 56,
        grade: "C",
        greenhouseGasesEmission: 1.88,
        waterConsumption: 2.82,
        metrics: [
          {
            name: "number_requests",
            value: 16,
            status: "info",
            recommandation: "< 30 requests",
          },
          {
            name: "page_size_kbytes",
            value: 1200,
            status: "warning",
            recommandation: "< 1000kb",
          },
          {
            name: "Page_complexity",
            value: 3000,
            status: "error",
            recommandation: "Between 300 and 500 nodes",
          },
        ],
        estimatation_co2: {
          comment:
            "Pour un total de 2000 visites par mois, ceci correspond à 42km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)",
          commentDetails: { numberOfVisit: 2000, value_km: 42, value: 42, unit: 'km' },
        },
        estimatation_water: {
          comment: "Pour un total de 2000 visites par mois, ceci correspond à 1 douche",
          commentDetails: { numberOfVisit: 2000, value_shower: 1, value: 1, unit: 'douches' },
        }
      },
    ],
  });

  const consoleLogMock = jest.spyOn(global.console, "log").mockImplementation();
  json(sampleAudit, { visits: 2000 });
  const result = consoleLogMock.mock.calls.join("\n");
  expect(JSON.stringify(JSON.parse(result))).toEqual(expected);
  consoleLogMock.mockRestore();
});
