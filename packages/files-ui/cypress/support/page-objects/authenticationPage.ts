import { basePage } from "./basePage"

export const authenticationPage = {
  ...basePage,

  // get started section elements
  web3Button: () => cy.get("[data-cy=web3]"),
  showMoreButton: () => cy.get("div.svelte-q1527 > .bn-onboard-custom"),
  detectedWallet: () => cy.get(":nth-child(3) > .bn-onboard-custom > span.svelte-1799bj2"),
  web3SignInButton: () => cy.get("[data-cy=sign-in-with-web3-button]"),

  // sign in section elements
  loginPasswordButton: () => cy.get("[data-cy=login-password-button]", { timeout: 20000 }),
  loginPasswordInput: () => cy.get("[data-cy=login-password-input]"),

  // save browser section elements
  saveBrowserButton: () => cy.get("[data-cy=save-browser-button]"),
  doNotSaveBrowserButton: () => cy.get("[data-cy=do-not-save-browser-button]")
}
