const {
  getComplementaryGESInfo,
  getComplementaryWaterInfo,
} = require("../utils");
const fs = require('fs');

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
      unit: "gCO2e",
      comment: getComplementaryGESInfo(result.greenhouseGasesEmission, options),
    },
    {
      label: "Eau",
      value: result.waterConsumption,
      unit: "cl",
      comment: getComplementaryWaterInfo(result.waterConsumption, options),
    },
  ];

  const formattedJSON = JSON.stringify(data, null, 2);

  if(options.outputPath && options.outputPathDir){
    fs.mkdirSync(options.outputPathDir, { recursive: true });
    fs.writeFileSync(options.outputPath, formattedJSON);
  }
  console.log(formattedJSON);
};
