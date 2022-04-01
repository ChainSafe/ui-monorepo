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
import { BucketType } from "@chainsafe/files-api-client"
import { navigationMenu } from "./page-objects/navigationMenu"

export type Storage = Record<string, string>[];

export interface Web3LoginOptions {
  url?: string
  withNewUser?: boolean
  clearPins?: boolean
  deleteFpsBuckets?: boolean
  withNewSession?: boolean
}

Cypress.Commands.add("clearPins", apiTestHelper.clearPins)

Cypress.Commands.add("deleteBuckets", (type: BucketType | BucketType[]) => {
  apiTestHelper.deleteBuckets(type)
})

Cypress.Commands.add(
  "web3Login",
  ({
    url = localHost,
    clearPins = false,
    withNewUser = true,
    deleteFpsBuckets = false,
    withNewSession = false
  }: Web3LoginOptions = {}) => {

    cy.on("window:before:load", (win) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847",
        4
      )
      const signer = withNewUser
        ? Wallet.createRandom()
        : new Wallet(testPrivateKey, provider)
      // inject ethereum object in the global window
      Object.defineProperty(win, "ethereum", {
        get: () => new CustomizedBridge(signer as any, signer.address, provider as any)
      })
    })

    if (withNewUser || withNewSession){
      const sessionName = `web3loginNewUser-${withNewSession ? new Date().toString() : "0"}`
      cy.session(sessionName, () => {
        cy.visit(url)
        authenticationPage.web3Button().click()
        authenticationPage.showMoreButton().click()
        authenticationPage.detectedWallet().click()
        authenticationPage.web3SignInButton().safeClick()
        bucketsPage.bucketsHeaderLabel().should("be.visible")
      })
    } else {
      cy.session("web3loginTestUser", () => {
        cy.visit(url)
        authenticationPage.web3Button().click()
        authenticationPage.showMoreButton().click()
        authenticationPage.detectedWallet().click()
        authenticationPage.web3SignInButton().safeClick()
        bucketsPage.bucketsHeaderLabel().should("be.visible")
      })
    }

    cy.visit(url)
    bucketsPage.bucketsHeaderLabel().should("be.visible")

    if(clearPins){
      cy.clearPins()
      navigationMenu.bucketsNavButton().click()
      navigationMenu.cidsNavButton().click()
    }

    if (deleteFpsBuckets) {
      apiTestHelper.deleteBuckets("fps")
    }
  }
)

Cypress.Commands.add("safeClick", { prevSubject: "element" }, ($element?: JQuery<HTMLElement>) => {
  const click = ($el: JQuery<HTMLElement>) => $el.trigger("click")
  return cy
    .wrap($element)
    .should("be.visible")
    .should("be.enabled")
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
       * @param {Boolean} options.withNewUser - (default: true) - whether to create a new user for this session.
       * @param {Boolean} options.clearCSFBucket - (default: false) - whether any file in the csf bucket should be deleted.
       * @param {Boolean} options.withNewSession - (default: false) - whether to create a new session.
       */
      web3Login: (options?: Web3LoginOptions) => void

      /**
       * Remove all "queued", "pinning", "pinned", "failed" pins
       */
      clearPins: () => void

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
      safeClick: ($element?: JQuery<HTMLElement>) => Chainable

      /**
       * Clear a bucket.
       * @param {BucketType} - what bucket type to clear for this user.
       * @example cy.deleteBuckets("fps")
       * @example cy.deleteBuckets(["fps","csf"])
       */
      deleteBuckets: (type: BucketType | BucketType[]) => void
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {}