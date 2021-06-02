import { basePage } from "./basePage"

export const landingPage = {
  ...basePage,
  web3Button: () => cy.get("[data-cy=web3]"),
  web3LoginButton: () => cy.get("[data-cy=sign-in-with-web3-button]", { timeout: 20000 }),
  passwordButton: () => cy.get("[data-cy=login-password-button]", { timeout: 20000 }),
  passwordTextfield: () => cy.get("[data-cy=login-password-input]"),
  saveBrowserButton: () => cy.get("[data-cy=save-browser-button]"),
  doNotsaveBrowserButton: () => cy.get("[data-cy=do-not-save-browser-button]")
}
