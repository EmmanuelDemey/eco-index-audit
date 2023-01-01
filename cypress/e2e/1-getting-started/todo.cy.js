/// <reference types="cypress" />

describe('example to-do app', () => {
  const url = 'https://www.google.fr'
  beforeEach(() => {
    cy.visit(url)
  })

  it('should have a good ecoindex', () => {
    const threshold = 99
    cy.task("checkEcoIndex", url).its('ecoIndex').should('be.greaterThan', threshold);
  })
})
