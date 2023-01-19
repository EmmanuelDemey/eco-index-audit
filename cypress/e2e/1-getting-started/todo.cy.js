/// <reference types="cypress" />
const path = require("path");

describe("example to-do app", () => {
  const url = "https://www.google.fr";
  beforeEach(() => {
    cy.visit(url);
  });

  it("should have a good ecoindex", () => {
    const threshold = 50;
    const outputPathDir = path.join(__dirname, "ecoIndex")
    cy.task("checkEcoIndex", {
      url,
      overrideOptions: {
        output: "json",
        outputPathDir,
        outputPath: path.join(outputPathDir, "result.json"),
        beforeClosingPageTimeout: 10000,
        waitForSelector: 'button'
      },
    })
      .its("ecoIndex", { timeout: 0 })
      .should("be.greaterThan", threshold);
  });
});
