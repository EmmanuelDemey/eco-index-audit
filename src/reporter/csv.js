const {getComplementaryGESInfo, getComplementaryWaterInfo} = require("../utils");
const fs = require('fs');

module.exports =  (result, options) => {
    const rows = [["Métrique", "Valeur", "Informations complémentaires"].join(',')]


    rows.push(...[
        ["EcoIndex", result.ecoIndex + '/100', ''].join(','),
        ["Note", result.grade, ''].join(','),
        ["GES", result.greenhouseGasesEmission + 'eqCO2', getComplementaryGESInfo(result.greenhouseGasesEmission, options)].join(','),
        ["Eau", result.waterConsumption + 'cl', getComplementaryWaterInfo(result.waterConsumption, options)].join(',')
    ]);

    const formattedCSV = rows.join('\n').toString()
    if(options.outputPath && options.outputPathDir){
        fs.mkdirSync(options.outputPathDir, { recursive: true });
        fs.writeFileSync(options.outputPath, formattedCSV);
    }

    console.log(formattedCSV);
}
