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

import { authenticationPage } from "./page-objects/authenticationPage"
import { apiTestHelper } from "./utils/apiTestHelper"
import { bucketsPage } from "./page-objects/bucketsPage"
import { ethers, Wallet } from "ethers"
import { testPrivateKey, localHost } from "../fixtures/loginData"
import { CustomizedBridge } from "./utils/CustomBridge"
import "cypress-file-upload"
import "cypress-pipe"

export type Storage = Record<string, string>[];

export interface Web3LoginOptions {
  url?: string
  apiUrlBase?: string
  saveBrowser?: boolean
  clearPins?: boolean
}

Cypress.Commands.add("clearPins", (apiUrlBase: string) => {
  apiTestHelper.clearPins(apiUrlBase)
})

Cypress.Commands.add(
  "web3Login",
  ({
    url = localHost,
    apiUrlBase = "https://stage.imploy.site/api/v1",
    clearPins = false
  }: Web3LoginOptions = {}) => {

    cy.on("window:before:load", (win) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847",
        4
      )
      const signer = new Wallet(testPrivateKey, provider)
      // inject ethereum object in the global window
      Object.defineProperty(win, "ethereum", {
        get: () => new CustomizedBridge(signer as any, provider as any)
      })
    })

    // with nothing in localstorage (and in session storage)
    // the whole login flow should kick in
    cy.session("web3login", () => {
      cy.visit(url)
      authenticationPage.web3Button().click()
      authenticationPage.showMoreButton().click()
      authenticationPage.detectedWallet().click()
      authenticationPage.web3SignInButton().safeClick()
      bucketsPage.bucketsHeaderLabel().should("be.visible")
    })

    cy.visit(url)
    bucketsPage.bucketsHeaderLabel().should("be.visible")

    if(clearPins){
      cy.clearPins(apiUrlBase)
    }
  }
)

Cypress.Commands.add("safeClick", { prevSubject: "element" }, $element => {
  const click = ($el: JQuery<HTMLElement>) => $el.trigger("click")
  return cy
    .wrap($element)
    .should("be.visible")
    .pipe(click)
    .should($el => expect($el).to.not.be.visible)
})

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login using Metamask to an instance of Storage.
       * @param {String} options.url - (default: "http://localhost:3000") - what url to visit.
       * @param {String} apiUrlBase - (default: "https://stage.imploy.site/api/v1") - what url to call for the api.
       */
      web3Login: (options?: Web3LoginOptions) => Chainable

      /**
       * Remove all "queued", "pinning", "pinned", "failed" pins
       * @param {String} apiUrlBase - what url to call for the api.
       * @example cy.clearPins("https://stage.imploy.site/api/v1")
       */
      clearPins: (apiUrlBase: string) => Chainable

      /**
       * Use this when encountering race condition issues resulting in
       * cypress "detached from DOM" issues or clicking before an event
       * listener has been registered
       *
       * Temporary solution until cypress improve this issue
       * further info
       * https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
       * https://github.com/testing-library/cypress-testing-library/issues/153#issuecomment-692386444
       * https://github.com/cypress-io/cypress/issues/7306
       * 
       */
      safeClick: () => Chainable
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {}