/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    web3Login(): void
  }
}