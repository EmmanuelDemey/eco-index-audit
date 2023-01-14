const convertGreenHouseGasesEmission = (value, visits) => {
  // greenhouseGasesEmission is in g
  const input = 90; // 90g CO2 /km (gCO2e)
  return Math.round((value * visits) / input);
};

const convertWater = (value, visits) => {
  // waterConsumption is in cl
  const input = 60; // 60L / douche
  return Math.round(((value / 100) * visits) / input);
};

const getComplementaryGESInfo = (greenhouseGasesEmission, options) => {
  const convertedValue = convertGreenHouseGasesEmission(greenhouseGasesEmission, options.visits);
  return `Pour un total de ${options.visits} visites par mois, ceci correspond à ${convertedValue}km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)`;
};

const getComplementaryWaterInfo = (waterConsumption, options) => {
  const convertedValue = convertWater(waterConsumption, options.visits);
  return `Pour un total de ${options.visits} visites par mois, ceci correspond à ${convertedValue} douche${
    convertedValue > 1 ? "s" : ""
  }`;
};

module.exports = {
  getComplementaryGESInfoAndDetails: (greenhouseGasesEmission, options) => {
    return {
      comment: getComplementaryGESInfo(greenhouseGasesEmission, options),
      commentDetails: {
        numberOfVisit: options.visits,
        value_km: convertGreenHouseGasesEmission(greenhouseGasesEmission, options.visits),
        value: convertGreenHouseGasesEmission(greenhouseGasesEmission, options.visits),
        unit: 'km'
      },
    };
  },
  getComplementaryWaterInfoAndDetails: (waterConsumption, options) => {
    return {
      comment: getComplementaryWaterInfo(waterConsumption, options),
      commentDetails: {
        numberOfVisit: options.visits,
        value_shower: convertWater(waterConsumption, options.visits),
        value: convertWater(waterConsumption, options.visits),
        unit: 'douches'
      },
    };
  },

  getComplementaryGESInfo,

  getComplementaryWaterInfo,
};
