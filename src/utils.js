module.exports = {
  getComplementaryGESInfo: (greenhouseGasesEmission, options) => {
    // greenhouseGasesEmission is in g
    const input = 90; // 90g CO2 /km (gCO2e)
    const convertedValue = Math.round(
      (greenhouseGasesEmission * options.visits) / input
    );
    return `Pour un total de ${options.visits} visites par mois, ceci correspond à ${convertedValue}km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)`;
  },

  getComplementaryWaterInfo: (waterConsumption, options) => {
    // waterConsumption is in cl
    const input = 60; // 60L / douche
    const convertedValue = Math.round(
      ((waterConsumption / 100) * options.visits) / input
    );
    return `Pour un total de ${
      options.visits
    } visites par mois, ceci correspond à ${convertedValue} douche${
      convertedValue > 1 ? "s" : ""
    }`;
  },
};
