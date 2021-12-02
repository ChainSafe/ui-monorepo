import { basePage } from "./basePage"

export const authenticationPage = {
  ...basePage,

  goToLoginButton: () => cy.get("[data-cy=button-go-to-login]"),
  invalidLinkMessage: () => cy.get("[data-cy=label-invalid-link]", { timeout: 10000 }),
  ErrorIcon: () => cy.get("[data-cy=icon-link-error", { timeout: 10000 }),

  // get started section elements
  signInToAccessShareLabel: () => cy.get("[data-cy=label-sign-in-to-access-share]"),
  web3Button: () => cy.get("[data-cy=web3]"),
  showMoreButton: () => cy.get("div.svelte-q1527 > .bn-onboard-custom"),
  detectedWallet: () => cy.get(":nth-child(3) > .bn-onboard-custom > span.svelte-1799bj2"),
  web3SignInButton: () => cy.get("[data-cy=sign-in-with-web3-button]"),

  // sign in section elements
  loginPasswordButton: () => cy.get("[data-cy=login-password-button]", { timeout: 20000 }),
  loginPasswordInput: () => cy.get("[data-cy=login-password-input]"),
  signInExplainerContinueButton: () => cy.get("[data-cy=button-sign-in-explainer-continue]", { timeout: 20000 }),
  signInSetupPasswordInput: () => cy.get("[data-cy=input-sign-in-password]"),
  signInSetupPasswordVerificationInput: () => cy.get("[data-cy=input-sign-in-password-verification]"),
  signInSetupPasswordSubmitButton: () => cy.get("[data-cy=button-sign-in-password]"),

  // save browser section elements
  saveBrowserButton: () => cy.get("[data-cy=save-browser-button]"),
  doNotSaveBrowserButton: () => cy.get("[data-cy=do-not-save-browser-button]")
}
