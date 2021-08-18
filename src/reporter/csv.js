const {getComplementaryGESInfo, getComplementaryWaterInfo} = require("../utils");

module.exports =  (result, options) => {
    const rows = [["Métrique", "Valeur", "Informations complémentaires"].join(',')]


    rows.push(...[
        ["EcoIndex", result.ecoIndex + '/100', ''].join(','),
        ["Note", result.grade, ''].join(','),
        ["GES", result.greenhouseGasesEmission + 'eqCO2', getComplementaryGESInfo(result.greenhouseGasesEmission, options)].join(','),
        ["Eau", result.waterConsumption + 'cl', getComplementaryWaterInfo(result.waterConsumption, options)].join(',')
    ]);

    console.log(rows.join('\n').toString());
}
