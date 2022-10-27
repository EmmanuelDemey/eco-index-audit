const puppeteer = require("puppeteer");

module.exports = {
    counterNumberOfNode(page){
      return page.evaluate(() => {
        return document.getElementsByTagName("*").length;
      });
    },
    async audit(urls){
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      let numberOfRequests = 0;
      let sizeOfRequests = 0;
    
      const devToolsResponses = new Map();
      const devTools = await page.target().createCDPSession();
      await devTools.send("Network.enable");
    
      devTools.on("Network.responseReceived", (event) => {
        devToolsResponses.set(event.requestId, event.response);
      });
    
      devTools.on("Network.loadingFinished", (event) => {
        numberOfRequests++;
        sizeOfRequests += event.encodedDataLength;
      });
  
      const results = [];
      for (const url of urls) {
        numberOfRequests = 0;
        sizeOfRequests = 0;
    
        await page.goto(url);
        const metrics = await this.counterNumberOfNode(page)
  
        results.push({
          url,
          metrics,
          numberOfRequests,
          sizeOfRequests
        });
      }
  
      await browser.close();
      return results;
    }
  };