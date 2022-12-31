/// <reference types="cypress" />

describe('example to-do app', () => {
  const url = 'https://www.google.fr'
  beforeEach(() => {
    cy.visit(url)
  })

  it('should have a good ecoindex', () => {
    const threshold = 50
    let ecoIndex;
    cy.task("checkEcoIndex", url).then(response => ecoIndex = response.ecoIndex)
    cy.waitUntil(() => {
      return ecoIndex >= threshold
    }, { errorMsg: `L'EcoIndex est inférieur à ${threshold}`, verbose: true})

  })
})
