/// <reference types="cypress" />

describe('example to-do app', () => {
  const url = 'https://google.com'
  beforeEach(() => {
    cy.visit(url)
  })

  it('should have a good ecoindex', async () => {
    cy.task("checkEcoIndex", url).its('ecoIndex').should('be.greaterThan', 60);
  })
})
