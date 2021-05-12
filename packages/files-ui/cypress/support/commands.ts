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
import { GenericStorageStore } from "./utils/GenericStorageStore"

export type Storage = Record<string, string>[]

export interface Web3LoginOptions {
  url?: string
  saveBrowser?: boolean
  useLocalAndSessionStorage?: boolean
}

const SESSION_FILE = "cypress/fixtures/storage/sessionStorage.json"
const LOCAL_FILE = "cypress/fixtures/storage/localStorage.json"
const storageStore = GenericStorageStore.Instance

Cypress.Commands.add("web3Login", ({ saveBrowser = false, url = localHost, useLocalAndSessionStorage = true }: Web3LoginOptions = {}) => {

  cy.task<string | null>("readFileMaybe", SESSION_FILE)
    .then((unparsedSession) => {
      const session = unparsedSession && JSON.parse(unparsedSession)

      if(!session?.length) {
        cy.log("session noting in there", session)
        return
      }

      console.log("0 session", session)
      storageStore.set("session", session)
      // sessionS = session
      console.log("1-> session done")

    })

  cy.task<string | null>("readFileMaybe", LOCAL_FILE)
    .then((unparsedLocal) => {
      const local = unparsedLocal && JSON.parse(unparsedLocal)

      if(!local?.length) {
        cy.log("local noting in there", local)
        return
      }

      storageStore.set("local", local)
      console.log("2-> local done")
      // localS = local
    })

  cy.on("window:before:load", (win) => {
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847", 4)
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

    if (useLocalAndSessionStorage){
    // if (useLocalAndSessionStorage && localS && sessionS){
      // console.log("localS", localS)
      // console.log("sessionS", sessionS)
      const local = storageStore.get("local")
      const session = storageStore.get("session")
      console.log("3.0locc", local)
      session.forEach(({ key, value }) => {
        win.localStorage.setItem(key, value)
      })

      local.forEach(({ key, value }) => {
        win.sessionStorage.setItem(key, value)
      })
      console.log("3.1 feeding done")
    }
  })

  cy.visit(url)

  // with nothing in localstorage (and in session storage)
  // the whole login flow should kick in
  cy.then(() => {
    cy.log("boom", storageStore.get("local").length)
    if(storageStore.get("local").length === 0){
      cy.log("<--- nothing")
      cy.get("[data-cy=web3]").click()
      cy.get(".bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom").click()
      cy.get("[data-cy=sign-in-with-web3-button]").click()
      cy.get("[data-cy=login-password-button]", { timeout: 10000 }).click()
      cy.get("[data-cy=login-password-input]").type(`${testAccountPassword}{enter}`)

      if(saveBrowser){
      // this is taking forever for test accounts
        cy.get("[data-cy=save-browser-button]").click()
      } else {
        cy.get("[data-cy=do-not-save-browser-button]").click()
      }
    }
  })

  cy.get("[data-cy=files-app-header", { timeout: 20000 }).should("be.visible")

  // save local and session storage in files
  cy.window().then((win) => {
    console.log("4 saving everything")
    const local: Array<Record<string, string>> = []
    const session: Array<Record<string, string>> = []

    Object.keys(win.localStorage).forEach((key) => {
      local.push({ key, value: localStorage.getItem(key) || "" })
    })

    Object.keys(win.sessionStorage).forEach((key) => {
      session.push({ key, value: sessionStorage.getItem(key) || "" })
    })

    // storageStore.set("local", local)
    // storageStore.set("session", session)

    const localData = JSON.stringify(local)
    const sessionData = JSON.stringify(session)

    cy.writeFile(SESSION_FILE, sessionData)
    cy.writeFile(LOCAL_FILE, localData)
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
      * @param {Boolean} options.useLocalAndSessionStorage - (default: true) - use what could have been stored before to speedup login
      * @example cy.web3Login({saveBrowser: true, url: 'http://localhost:8080'})
      */
      web3Login: (options?: Web3LoginOptions) => Chainable
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {}