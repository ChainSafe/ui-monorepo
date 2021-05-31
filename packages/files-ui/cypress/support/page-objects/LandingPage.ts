import { BasePage } from "./BasePage"

export class LandingPage extends BasePage {

  web3Button() {
    return cy.get("[data-cy=web3]")
  }

  web3LoginButton() {
    return cy.get("[data-cy=sign-in-with-web3-button]", { timeout: 20000 })
  }

  passwordButton() {
    return cy.get("[data-cy=login-password-button]", { timeout: 20000 })
  }

  passwordTextfield() {
    return cy.get("[data-cy=login-password-input]")
  }

  saveBrowserButton() {
    return cy.get("[data-cy=save-browser-button]")
  }

  doNotsaveBrowserButton() {
    return cy.get("[data-cy=do-not-save-browser-button]")
  }

}
