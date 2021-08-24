import { basePage } from "./basePage"

export const authenticationPage = {
  ...basePage,

  // get started section elements
  web3Button: () => cy.get("[data-cy=web3]", { timeout: 120000 }),
  showMoreButton: () => cy.get("div.svelte-q1527 > .bn-onboard-custom"),
  detectedWallet: () => cy.get(":nth-child(3) > .bn-onboard-custom > span.svelte-1799bj2"),
  web3SignInButton: () => cy.get("[data-cy=sign-in-with-web3-button]", { timeout: 10000 })
}
