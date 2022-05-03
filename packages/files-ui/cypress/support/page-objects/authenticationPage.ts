import { basePage } from "./basePage"

export const authenticationPage = {
  ...basePage,

  goToLoginButton: () => cy.get("[data-cy=button-go-to-login]"),
  invalidLinkMessage: () => cy.get("[data-cy=label-invalid-link]", { timeout: 10000 }),
  errorIcon: () => cy.get("[data-cy=icon-link-error", { timeout: 10000 }),

  // get started section elements
  signInToAccessShareLabel: () => cy.get("[data-cy=label-sign-in-to-access-share]"),
  web3Button: () => cy.get("[data-cy=button-web3]"),
  showMoreButton: () => cy.get("div.svelte-q1527 > .bn-onboard-custom"),
  detectedWallet: () => cy.get(":nth-child(3) > .bn-onboard-custom > span.svelte-1799bj2"),
  web3SignInButton: () => cy.get("[data-cy=button-sign-in-with-web3]"),
  privacyPolicyButton: () => cy.get("[data-cy=button-privacy-policy]"),
  termsAndConditionsButton: () => cy.get("[data-cy=button-terms-and-conditions]"),
  learnMoreAboutChainsafeButton: () => cy.get("[data-cy=button-learn-more-about-chainsafe]"),

  // sign in section elements
  loginPasswordButton: () => cy.get("[data-cy=button-login-password]", { timeout: 20000 }),
  loginPasswordInput: () => cy.get("[data-cy=input-login-password]"),
  signInExplainerContinueButton: () => cy.get("[data-cy=button-sign-in-explainer-continue]", { timeout: 20000 }),
  signInSetupPasswordInput: () => cy.get("[data-cy=input-sign-in-password]"),
  signInSetupPasswordVerificationInput: () => cy.get("[data-cy=input-sign-in-password-verification]"),
  signInSetupPasswordSubmitButton: () => cy.get("[data-cy=button-sign-in-password]"),

  // save browser section elements
  saveBrowserButton: () => cy.get("[data-cy=button-save-browser]"),
  doNotSaveBrowserButton: () => cy.get("[data-cy=button-do-not-save-browser]")
}
