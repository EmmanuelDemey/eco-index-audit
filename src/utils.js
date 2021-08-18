module.exports = {
    getComplementaryGESInfo: (greenhouseGasesEmission, options) => {
        const input = 90; // 90 CO2 g/km
        const convertedValue = Math.round(greenhouseGasesEmission * options.visits / input);
        return `Pour un total de ${options.visits} visites par mois, ceci correspond à ${convertedValue}km en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)`;
    },

    getComplementaryWaterInfo: (waterConsumption, options) => {
        const input = 60; // 60L / douche
        const convertedValue = Math.round(waterConsumption * options.visits / input);
        return `Pour un total de ${options.visits} visites par mois, ceci correspond à ${convertedValue} douches`;
    }
}

