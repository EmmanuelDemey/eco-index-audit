const puppeteer = require("puppeteer");
const chalk = require("chalk")
const highlight = require('cli-highlight').highlight
const format = require('html-format');
const Table = require("cli-table");

const logger = async (...messages) => {
  let results;
  
  if(process.env.ECOINDEX_VERBOSE !== 'true'){
    return;
  }

  if(typeof messages[0] === 'function'){
    const data = await messages[0]();
    if(Array.isArray(data)){
      results = data;
    }
    
    results = [data]
  } else {
    results = messages
  }
  
  if(results.length === 1 && results[0]?.options?.head){
    console.log(chalk.bgBlue('EcoIndex'));
    console.log(results[0].toString());
  } else {
    console.log(chalk.bgBlue('EcoIndex'), ...results);
  }
}

module.exports = {
    counterNumberOfNode(page){
      return page.evaluate(() => {
        return document.getElementsByTagName("*").length;
      });
    },

    async audit(urls, {beforeScript, afterScript, headless, globals, remote_debugging_port, remote_debugging_address, initialValues, beforeClosingPageTimeout }){
      const shouldReuseExistingChromium = remote_debugging_port && remote_debugging_address;
      let browser;

      if(shouldReuseExistingChromium){
        const remote_address = `http://${remote_debugging_address}:${remote_debugging_port}`
        logger('Connecting Puppeteer to an existing Chromium', remote_address)
        browser = await puppeteer.connect({
          browserURL: remote_address
        })
      } else {
        browser = await puppeteer.launch({
          headless,
          devtools: !headless
        });
      }
      
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
        logger(chalk.blue('Intercept HTTP Request'), event.response.url)
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
    
        await page.goto(url, { waitUntil: "domcontentloaded" });

        if(beforeScript){
          await page.evaluate(beforeScript, globals);
          numberOfRequests = 0;
          sizeOfRequests = 0;
          await page.goto(url, { waitUntil: "domcontentloaded" });
        }

        if(process.env.ECOINDEX_DISPLAY_HTML === 'true'){
          logger(async () => {
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            return highlight(format(data), {language: 'html', ignoreIllegals: true});
          })
        }

        if(afterScript){
          await page.evaluate(afterScript, globals)
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
          metrics: metrics + (initialValues?.[url]?.metrics ?? 0),
          numberOfRequests: numberOfRequests + (initialValues?.[url]?.numberOfRequests ?? 0),
          sizeOfRequests: sizeOfRequests + (initialValues?.[url]?.sizeOfRequests ?? 0)
        });
      }
  
      if(beforeClosingPageTimeout){
        await new Promise(r => setTimeout(r, beforeClosingPageTimeout));
      }

      if(!shouldReuseExistingChromium){
        await browser.close();
      } else {
        page.close();
      }


      logger(() => {
        const table = new Table({
          head: ["URL", "Number of Nodes", "Number of Requests", "Total Requests Size"]
        });
        results.forEach(result => {
          table.push(
            [result.url, result.metrics, result.numberOfRequests, result.sizeOfRequests],
          );
        })
        return Promise.resolve(table)
      });

      return results;
    }
  };