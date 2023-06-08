const {
  getComplementaryGESInfo,
  getComplementaryWaterInfo,
} = require("../utils");

const Table = require("cli-table");

module.exports = (result, options) => {
  const table = new Table({
    head: ["Métrique", "Valeur", "Informations complémentaires"],
  });

  table.push(
    ["EcoIndex", result.ecoIndex + "/100", ""],
    ["Note", result.grade, ""],
    [
      "GES",
      result.greenhouseGasesEmission + "eqCO2",
      getComplementaryGESInfo(result.greenhouseGasesEmission, options),
    ],
    [
      "Eau",
      result.waterConsumption + "cl",
      getComplementaryWaterInfo(result.waterConsumption, options),
    ]
  );

  console.log(table.toString());
};
