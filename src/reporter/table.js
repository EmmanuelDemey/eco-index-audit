const Table = require("cli-table");
const TOTAL_VISITS = 10000;

module.exports =  (result) => {
    const table = new Table({
      head: ["Métrique", "Valeur", "Informations complémentaires"]
    });

    function getComplementaryGESInfo(greenhouseGasesEmission) {
        const input = 90; // 90 CO2 g/km
        const convertedValue = Math.round(greenhouseGasesEmission * TOTAL_VISITS / input);
        return `Pour un total de ${TOTAL_VISITS} visites par mois, ceci correspond à ${convertedValue}km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)`;
    }

    function getComplementaryWaterInfo(waterConsumption) {
        const input = 60; // 60L / douche
        const convertedValue = Math.round(waterConsumption * TOTAL_VISITS / input);
        return `Pour un total de ${TOTAL_VISITS} visites par mois, ceci correspond à ${convertedValue} douches`;
    }

    table.push(
      ["EcoIndex", result.ecoIndex + '/100', ''],
      ["Note", result.grade, ''],
      ["GES", result.greenhouseGasesEmission + 'eqCO2', getComplementaryGESInfo(result.greenhouseGasesEmission)],
      ["Eau", result.waterConsumption + 'cl', getComplementaryWaterInfo(result.waterConsumption)]
    );

    console.log(table.toString());
  }
