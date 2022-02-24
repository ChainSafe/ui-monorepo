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
import { apiTestHelper, ClearBucketType } from "./utils/apiTestHelper"
import { ethers, Wallet } from "ethers"
import { homePage } from "./page-objects/homePage"
import { testPrivateKey, testAccountPassword, localHost } from "../fixtures/loginData"
import { CustomizedBridge } from "./utils/CustomBridge"
import "cypress-file-upload"
import "cypress-pipe"
import { navigationMenu } from "./page-objects/navigationMenu"

Cypress.Commands.add("clearBucket", (bucketType: ClearBucketType) => {
  apiTestHelper.clearBucket(bucketType)
})

export interface Web3LoginOptions {
  url?: string
  saveBrowser?: boolean
  useLocalAndSessionStorage?: boolean
  clearCSFBucket?: boolean
  clearTrashBucket?: boolean
  deleteShareBucket?: boolean
  withNewUser?: boolean
  deleteCreditCard? : boolean
  resetToFreePlan?: boolean
}

Cypress.Commands.add(
  "web3Login",
  ({
    saveBrowser = false,
    url = localHost,
    clearCSFBucket = false,
    clearTrashBucket = false,
    deleteShareBucket = false,
    withNewUser = true,
    deleteCreditCard = false,
    resetToFreePlan = false
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

    if (withNewUser){
      cy.session("web3loginNewUser", () => {
        cy.visit(url)
        authenticationPage.web3Button().click()
        authenticationPage.showMoreButton().click()
        authenticationPage.detectedWallet().click()
        authenticationPage.web3SignInButton().safeClick()
        authenticationPage.signInExplainerContinueButton().safeClick()
        // we are using the testAccount password here, but we could input anything
        authenticationPage.signInSetupPasswordInput().type(`${testAccountPassword}`)
        authenticationPage.signInSetupPasswordVerificationInput().type(`${testAccountPassword}{enter}`)

        homePage.appHeaderLabel().should("be.visible")
      })
    } else {
      cy.session("web3loginTestUser", () => {
        cy.visit(url)
        authenticationPage.web3Button().click()
        authenticationPage.showMoreButton().click()
        authenticationPage.detectedWallet().click()
        authenticationPage.web3SignInButton().safeClick()
        authenticationPage.loginPasswordButton().click()
        authenticationPage.loginPasswordInput().type(`${testAccountPassword}{enter}`)

        if (saveBrowser) {
          // this is taking forever for test accounts
          authenticationPage.saveBrowserButton().click()
        } else {
          authenticationPage.doNotSaveBrowserButton().click()
        }
        homePage.appHeaderLabel().should("be.visible")
      })
    }

    cy.visit(url)
    homePage.appHeaderLabel().should("be.visible")

    if (clearCSFBucket) {
      apiTestHelper.clearBucket("csf")
    }

    if (deleteShareBucket) {
      apiTestHelper.deleteSharedFolders()
    }

    if (clearTrashBucket) {
      apiTestHelper.clearBucket("trash")
    }

    if (deleteCreditCard) {
      apiTestHelper.deleteCreditCards()
    }

    if(resetToFreePlan){
      apiTestHelper.ensureUserIsOnFreePlan()
    }

    if(clearTrashBucket || clearCSFBucket || deleteShareBucket){
      navigationMenu.binNavButton().click()
      navigationMenu.homeNavButton().click()
    }

    homePage.appHeaderLabel().should("be.visible")
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

Cypress.Commands.add("iframeLoaded", { prevSubject: "element" }, ($iframe?: JQuery<HTMLElement>): any => {
  const contentWindow = $iframe?.prop("contentWindow")
  return new Promise(resolve => {
    if (
      contentWindow &&
              contentWindow.document.readyState === "complete"
    ) {
      resolve(contentWindow)
    } else {
      $iframe?.on("load", () => {
        resolve(contentWindow)
      })
    }
  })
})

Cypress.Commands.add("getInDocument", { prevSubject: "document" }, (document: any, selector: keyof HTMLElementTagNameMap) =>
  Cypress.$(selector, document))

Cypress.Commands.add("getWithinIframe", (targetElement: any, selector: string) =>
  cy.get(selector || "iframe", { timeout: 10000 })
    .iframeLoaded()
    .its("document")
    .getInDocument(targetElement))

Cypress.Commands.add("awaitStripeElementReady", () => {
  // this waits for all of the posts from stripe to ensure the element is ready event is received
  // by waiting for these to complete we can ensure the elements will be ready for interaction
  cy.intercept("POST", "**/r.stripe.com/*").as("stripeElementActivation")
  cy.wait("@stripeElementActivation")
})

Cypress.Commands.add("awaitStripeConfirmation", () => {
  cy.intercept("POST", "**/setup_intents/*/confirm").as("stripeConfirmation")
  cy.wait("@stripeConfirmation")
})

Cypress.Commands.add("awaitDefaultCardRequest", () => {
  cy.intercept("GET", "**/billing/cards/default").as("defaultCard")

  cy.wait("@defaultCard").its("response.body").should("contain", {
    type: "credit"
  })
})

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login using Metamask to an instance of Files.
       * @param {String} options.url - (default: "http://localhost:3000") - what url to visit.
       * @param {Boolean} options.saveBrowser - (default: false) - save the browser to localstorage.
       * @param {Boolean} options.clearCSFBucket - (default: false) - whether any file in the csf bucket should be deleted.
       * @param {Boolean} options.clearTrashBucket - (default: false) - whether any file in the trash bucket should be deleted.
       * @param {Boolean} options.deleteShareBucket - (default: false) - whether any shared bucket should be deleted.
       * @param {Boolean} options.withNewUser - (default: true) - whether to create a new user for this session.
       * @param {Boolean} options.deleteCreditCard - (default: false) - whether to delete the default credit card associate to the account.
       * @param {Boolean} options.resetToFreePlan - (default false) - whether to cancel any plan to make sure the user is on the free one.
       * @example cy.web3Login({saveBrowser: true, url: 'http://localhost:8080'})
       */
      web3Login: (options?: Web3LoginOptions) => void

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
       * @example cy.clearBucket("csf")
       */
      clearBucket: (bucketType: ClearBucketType) => void

      /**
       * Use when interacting with elements within an iframe eg Stripe
       */
      iframeLoaded: ($iframe?: JQuery<HTMLElement>) => any
      getInDocument: (document: any, selector: keyof HTMLElementTagNameMap) => JQuery<HTMLElement>
      getWithinIframe: (targetElement: string, selector: string) => Chainable

      /**
       * Use to wait on specific network responses for reliability:
       * awaitStripeElementReady - waits for all the api responses that initialize stripe elements
       * awaitStripeConfirmation - waits for the api response that confirms stripe setup
       * awaitDefaultCardRequest - waits for the api response containing the default credit card
       */
      awaitStripeElementReady: () => void
      awaitStripeConfirmation: () => void
      awaitDefaultCardRequest: () => void
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {}
