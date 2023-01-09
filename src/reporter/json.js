const { getComplementaryGESInfoAndDetails, getComplementaryWaterInfoAndDetails } = require("../utils");
const fs = require("fs");

module.exports = (result, options) => {
  const data = {
    score: result.ecoIndex,
    grade: result.grade,
    estimatation_co2: {
      ...getComplementaryGESInfoAndDetails(result.greenhouseGasesEmission, options),
    },
    estimatation_water: {
      ...getComplementaryWaterInfoAndDetails(result.waterConsumption, options),
    },
    pages: result.pages.map(page => {
      return {
        ...page, 
        estimatation_co2: {
          ...getComplementaryGESInfoAndDetails(page.greenhouseGasesEmission, options),
        },
        estimatation_water: {
          ...getComplementaryWaterInfoAndDetails(page.waterConsumption, options),
        }
      }
    }),
  };

  const formattedJSON = JSON.stringify(data, null, 2);

  if (options.outputPath && options.outputPathDir) {
    fs.mkdirSync(options.outputPathDir, { recursive: true });
    fs.writeFileSync(options.outputPath, formattedJSON);
  }
  console.log(formattedJSON);
};
