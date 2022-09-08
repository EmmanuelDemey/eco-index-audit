const {
  getComplementaryGESInfo,
  getComplementaryWaterInfo,
} = require("../utils");

module.exports = (result, options) => {
  const data = [
    {
      label: "EcoIndex",
      value: result.ecoIndex,
    },
    {
      label: "Note",
      value: result.grade,
    },
    {
      label: "GES",
      value: result.greenhouseGasesEmission,
      unit: result.greenhouseGasesEmission,
      comment: getComplementaryGESInfo(result.greenhouseGasesEmission, options),
    },
    {
      label: "Eau",
      value: result.waterConsumption,
      unit: "cl",
      comment: getComplementaryWaterInfo(result.waterConsumption, options),
    },
  ];
  console.log(JSON.stringify(data, null, 2));
};
