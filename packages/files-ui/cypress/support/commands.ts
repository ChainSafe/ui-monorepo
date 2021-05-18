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
import "cypress-file-upload"

export type Storage = Record<string, string>[]

export interface Web3LoginOptions {
  url?: string
  apiUrlBase?: string
  saveBrowser?: boolean
  useLocalAndSessionStorage?: boolean
  clearCSFBucket?: boolean
}

const SESSION_FILE = "cypress/fixtures/storage/sessionStorage.json"
const LOCAL_FILE = "cypress/fixtures/storage/localStorage.json"
const REFRSH_TOKEN_KEY = "csf.refreshToken"

Cypress.Commands.add("web3Login", ({ saveBrowser = false, url = localHost, apiUrlBase = "https://stage.imploy.site/api/v1", useLocalAndSessionStorage = true, clearCSFBucket = false }: Web3LoginOptions = {}) => {
  let session: Storage = []
  let local: Storage = []

  cy.task<string | null>("readFileMaybe", SESSION_FILE)
    .then((unparsedSession) => {
      session = unparsedSession && JSON.parse(unparsedSession) || []
    })

  cy.task<string | null>("readFileMaybe", LOCAL_FILE)
    .then((unparsedLocal) => {
      local = unparsedLocal && JSON.parse(unparsedLocal) || []
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
    cy.log("Logging in", !!local.length && "there is something in session storage ---> direct login")

    if (local.length === 0) {
      cy.log("nothing in session storage, --> click on web3 button")
      cy.get("[data-cy=web3]").click()
      cy.get(".bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom").click()
      cy.get("[data-cy=sign-in-with-web3-button]").click()
      cy.get("[data-cy=login-password-button]", { timeout: 20000 }).click()
      cy.get("[data-cy=login-password-input]").type(`${testAccountPassword}{enter}`)

      if (saveBrowser) {
        // this is taking forever for test accounts
        cy.get("[data-cy=save-browser-button]").click()
      } else {
        cy.get("[data-cy=do-not-save-browser-button]").click()
      }
    }
  })

  // save local and session storage in files
  cy.window().then((win) => {
    const newLocal: Storage = []
    const newSession: Storage = []
    let refreshToken = ""

    Object.keys(win.localStorage).forEach((key) => {
      newLocal.push({ key, value: localStorage.getItem(key) || "" })
    })

    Object.keys(win.sessionStorage).forEach((key) => {
      const value = sessionStorage.getItem(key) || ""
      newSession.push({ key, value })
      if (key === REFRSH_TOKEN_KEY) {
        refreshToken = value
      }
    })

    const newLocalString = JSON.stringify(newLocal)
    const newSessionString = JSON.stringify(newSession)

    cy.writeFile(SESSION_FILE, newSessionString)
    cy.writeFile(LOCAL_FILE, newLocalString)

    if (clearCSFBucket) {
      cy.request("POST", `${apiUrlBase}/user/refresh`, { "refresh": refreshToken })
        .then((res) => res.body.access_token.token)
        .then((accessToken) => {
          cy.request({
            method: "POST",
            url: `${apiUrlBase}/files/ls`,
            body: { "path": "/", "source": { "type": "csf" } },
            auth: { 'bearer': accessToken }
          }).then((res) => {
            const toDelete = res.body.map(({ name }: { name: string }) => `/${name}`)
            cy.request({
              method: "POST",
              url: `${apiUrlBase}/files/rm`,
              body: { "paths": toDelete, "source": { "type": "csf" } },
              auth: {
                'bearer': accessToken
              }
            }).then(res => { 
              if(!res.isOkStatusCode){
                throw new Error(`unexpected answer when deleting files: ${JSON.stringify(res, null, 2)}`)  
              }
              
              res.isOkStatusCode && cy.reload()
            })
          })
        })
    }
  })

  cy.get("[data-cy=files-app-header", { timeout: 20000 }).should("be.visible")
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
      * @param {Boolean} options.clearCSFBucket - (default: false) - whether any file in the csf bucket should be deleted. 
      * @example cy.web3Login({saveBrowser: true, url: 'http://localhost:8080'})
      */
      web3Login: (options?: Web3LoginOptions) => Chainable
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export { }
