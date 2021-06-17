const Table = require("cli-table");

module.exports =  (result) => {
    const table = new Table({
      head: ["Métrique", "Valeur"]
    });
  
    table.push(
      ["EcoIndex", result.ecoIndex + '/100'],
      ["Note", result.grade],
      ["GES", result.greenhouseGasesEmission],
      ["Eau", result.waterConsumption + 'cl']
    );
  
    console.log(table.toString());
  }