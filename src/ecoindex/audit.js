const PuppeteerTracker = require("./trackers/puppeteer");
const EcoIndex = require("ecoindex");

/**
  Calcul ecoIndex based on formula from web site www.ecoindex.fr
  **/
function computeEcoIndex(dom, req, size) {
  return EcoIndex.computeEcoIndex(dom, req, size);
}

function getEcoIndexGrade(ecoIndex) {
  return EcoIndex.getEcoIndexGrade(ecoIndex);
}

function computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex) {
  return EcoIndex.computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex);
}

function computeWaterConsumptionfromEcoIndex(ecoIndex) {
  return EcoIndex.computeWaterConsumptionfromEcoIndex(ecoIndex)
}

function checkUrl(url) {
  let givenURL;
  try {
    givenURL = new URL(url);
  } catch (error) {
    return false;
  }
  return givenURL.protocol === "http:" || givenURL.protocol === "https:";
}

const tracker = PuppeteerTracker;

const generateStatus = (received, expected) => {
  if (received < expected) {
    return "info";
  }
  if (received < expected * 4) {
    return "warning";
  }

  return "error";
};
module.exports = async (url, options) => {
  const urls = Array.isArray(url) ? url : [url];

  const wrongUrl = urls.find((url) => !checkUrl(url));
  if (wrongUrl) {
    console.error(`You have at least one malformed URL`);
  }

  const resultByUrl = await tracker.audit(urls, options);

  const result = resultByUrl.map(
    ({ metrics, numberOfRequests, sizeOfRequests, url }) => {
      const ecoIndex = computeEcoIndex(
        metrics,
        numberOfRequests,
        Math.round(sizeOfRequests / 1000)
      );
      return {
        url,
        ecoIndex,
        grade: getEcoIndexGrade(ecoIndex),
        greenhouseGasesEmission:
          computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex),
        waterConsumption: computeWaterConsumptionfromEcoIndex(ecoIndex),
        metrics: [
          {
            name: "number_requests",
            value: numberOfRequests,
            status: generateStatus(numberOfRequests, 30),
            recommandation: "< 30 requests",
          },
          {
            name: "page_size",
            value: Math.round(sizeOfRequests / 1024),
            status: generateStatus(Math.round(sizeOfRequests / 1024), 1000),
            recommandation: "< 1000kb",
          },
          {
            name: "Page_complexity",
            value: metrics,
            status: generateStatus(metrics, 500),
            recommandation: "Between 300 and 500 nodes",
          },
        ],
      };
    }
  );

  const ecoIndexAvg =
    result.reduce((acc, value) => acc + value.ecoIndex, 0) / result.length;
  return {
    pages: result,
    ecoIndex: ecoIndexAvg,
    grade: getEcoIndexGrade(ecoIndexAvg),
    greenhouseGasesEmission: result.reduce(
      (acc, value) => acc + value.greenhouseGasesEmission,
      0
    ),
    waterConsumption: result.reduce(
      (acc, value) => acc + value.waterConsumption,
      0
    ),
  };
};
