import { basePage } from "./basePage"

export const authenticationPage = {
  ...basePage,

  // get started section elements
  web3Button: () => cy.get("[data-cy=web3]", { timeout: 1200000 }),
  metaMaskButton: () => cy.get(".bn-onboard-modal-select-wallets > :nth-child(1) > .bn-onboard-custom"),
  web3SignInButton: () => cy.get("[data-cy=sign-in-with-web3-button]")
}
