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
import { ethers, Wallet } from "ethers"
import { testPrivateKey, localHost } from "../fixtures/loginData"
import { CustomizedBridge } from "./utils/CustomBridge"
import "cypress-file-upload"
import { cidsPage } from "./page-objects/cidsPage"

export type Storage = Record<string, string>[];

export interface Web3LoginOptions {
  url?: string
  apiUrlBase?: string
  saveBrowser?: boolean
  useLocalAndSessionStorage?: boolean
  clearCSFBucket?: boolean
  clearTrashBucket?: boolean
}

const SESSION_FILE = "cypress/fixtures/storage/sessionStorage.json"
const LOCAL_FILE = "cypress/fixtures/storage/localStorage.json"

Cypress.Commands.add("saveLocalAndSession", () => {
  // save local and session storage in files
  cy.window().then((win) => {
    const newLocal: Storage = []
    const newSession: Storage = []

    Object.keys(win.localStorage).forEach((key) => {
      newLocal.push({ key, value: win.localStorage.getItem(key) || "" })
    })

    Object.keys(win.sessionStorage).forEach((key) => {
      newSession.push({ key, value: win.sessionStorage.getItem(key) || "" })
    })

    const newLocalString = JSON.stringify(newLocal)
    const newSessionString = JSON.stringify(newSession)

    cy.writeFile(SESSION_FILE, newSessionString)
    cy.writeFile(LOCAL_FILE, newLocalString)
  })
})

Cypress.Commands.add(
  "web3Login",
  ({
    url = localHost,
    // apiUrlBase = "https://stage.imploy.site/api/v1",
    useLocalAndSessionStorage = true
  }: Web3LoginOptions = {}) => {
    let session: Storage = []
    let local: Storage = []

    cy.task<string | null>("readFileMaybe", SESSION_FILE).then(
      (unparsedSession) => {
        session = (unparsedSession && JSON.parse(unparsedSession)) || []
      }
    )

    cy.task<string | null>("readFileMaybe", LOCAL_FILE).then(
      (unparsedLocal) => {
        local = (unparsedLocal && JSON.parse(unparsedLocal)) || []
      }
    )

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

      // clear session storage in any case, if previous session storage should be
      // kept will be decided after.
      // Note that Cypress keep the session storage between test but clears localStorage
      win.sessionStorage.clear()
      win.localStorage.clear()

      if (useLocalAndSessionStorage) {
        session.forEach(({ key, value }) => {
          win.sessionStorage.setItem(key, value)
        })

        local.forEach(({ key, value }) => {
          win.localStorage.setItem(key, value)
        })
      }
    })

    cy.visit(url)

    // with nothing in localstorage (and in session storage)
    // the whole login flow should kick in
    cy.then(() => {
      cy.log(
        "Logging in",
        local.length > 0 &&
          "there is something in session storage ---> direct login"
      )

      if (local.length === 0) {
        cy.log("nothing in session storage, --> click on web3 button")
        // Temp change for testing in CI
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(60000)
        cy.reload
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(60000)
        authenticationPage.web3Button().click()
        authenticationPage.metaMaskButton().click()
        authenticationPage.web3SignInButton().click()
      }
    })

    cidsPage.cidsHeaderLabel().should("be.visible")

    cy.saveLocalAndSession()

  }
)

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login using Metamask to an instance of Files.
       * @param {String} options.url - (default: "http://localhost:3000") - what url to visit.
       * @param {String} apiUrlBase - (default: "https://stage.imploy.site/api/v1") - what url to call for the api.
       * @param {Boolean} options.useLocalAndSessionStorage - (default: true) - use what could have been stored before to speedup login
       * @example cy.web3Login({saveBrowser: true, url: 'http://localhost:8080'})
       */
      web3Login: (options?: Web3LoginOptions) => Chainable

      /**
       * Save local and session storage to local files
       * @example cy.saveLocalAndSession()
       */
      saveLocalAndSession: () => Chainable
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {}
