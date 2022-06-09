/// <reference types="cypress" />
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import "./commands"

// returning false prevents Cypress from failing the test automatically
Cypress.on("uncaught:exception", () => {
  return false
})

// Hide fetch/XHR requests
// interim solution until cypress adds configuration support
// source https://gist.github.com/simenbrekken/3d2248f9e50c1143bf9dbe02e67f5399
const app = window.top

if(app != null && !app.document.head.querySelector("[data-hide-command-log-request]")) {
  const style = app.document.createElement("style")
  style.innerHTML =
    ".command-name-request, .command-name-xhr { display: none }"
  style.setAttribute("data-hide-command-log-request", "")

  app.document.head.appendChild(style)
}

before(() => {
  // grant clipboard read permissions to the browser
  cy.wrap(
    Cypress.automation("remote:debugger:protocol", {
      command: "Browser.grantPermissions",
      params: {
        permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
        origin: window.location.origin
      }
    })
  )
})
