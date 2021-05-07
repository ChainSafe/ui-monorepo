/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { ethers, Wallet } from "ethers"
import { testPrivateKey, testAccountPassword, localHost } from "../fixtures/loginData"
import { CustomizedBridge } from "./utils/CustomBridge"

export interface Web3LoginOptions {
  url?: string
  saveBrowser?: boolean
}

Cypress.Commands.add("web3Login", ({ saveBrowser = false, url = localHost }: Web3LoginOptions = {}) => {
  cy.on("window:before:load", (win) => {
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847", 4)
    const signer = new Wallet(testPrivateKey, provider)

    // inject ethereum object in the global window
    Object.defineProperty(win, "ethereum", {
      get: () => new CustomizedBridge(signer as any, provider as any)
    })
    win.sessionStorage.clear()
  })

  cy.visit(url)
  cy.get("[data-cy=web3]").click()
  cy.get(".bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom").click()
  cy.get("[data-cy=sign-in-with-web3-button]").click()
  cy.get("[data-cy=login-password-button]", { timeout: 10000 }).click()
  cy.get("[data-cy=login-password-input]").type(`${testAccountPassword}{enter}`)

  if(saveBrowser){
    cy.get("[data-cy=save-browser-button]").click()
  } else {
    cy.get("[data-cy=do-not-save-browser-button]").click()
  }

  cy.get("[data-cy=files-app-header", { timeout: 15000 }).should("be.visible")
})

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  namespace Cypress {
    interface Chainable {
      /**
      * Login using Metamask to an instance of files running on localhost:3000.
      * @param {Object} options
      * @param {string} options.saveBrowser - save the browser to localstorage (default: false).
      * @param {string} options.url - what url to visit (default: "http://localhost:3000").
      * @example cy.web3Login({saveBrowser: true})
      */
      web3Login: (options?: Web3LoginOptions) => Chainable
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {}