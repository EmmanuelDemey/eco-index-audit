const puppeteer = require("puppeteer");

module.exports = {
    counterNumberOfNode(page){
      return page.evaluate(() => {
        return document.getElementsByTagName("*").length;
      });
    },
    async audit(urls, beforeScript, afterScript, headless){
      const browser = await puppeteer.launch({
        headless,
        devtools: !headless
      });
      const page = await browser.newPage();
  
      page.on('console', async (msg) => {
        const msgArgs = msg.args();
        for (let i = 0; i < msgArgs.length; ++i) {
          console.log(await msgArgs[i].jsonValue());
        }
      });
      
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

        if(beforeScript){
          await page.evaluate(beforeScript);
          numberOfRequests = 0;
          sizeOfRequests = 0;
          await page.goto(url);
        }


        if(afterScript){
          await page.evaluate(afterScript)
        }
        if(!headless){
          await page.evaluate(() => {
            // eslint-disable-next-line no-debugger
            debugger;
          })
        }

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