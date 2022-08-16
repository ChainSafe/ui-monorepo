import { basePage } from "./basePage"

export const navigationMenu = {
  ...basePage,
  homeNavButton: () => cy.get("[data-cy=home-nav]"),
  cidsNavButton: () => cy.get("[data-cy=cids-nav]"),
  bucketsNavButton: () => cy.get("[data-cy=buckets-nav]"),
  apiKeysNavButton: () => cy.get("[data-cy=api-keys-nav]"),
  // settingsNavButton: () => cy.get("[data-cy=settings-nav]"),
  // docsNavButton: () => cy.get("[data-cy=docs-nav]"),
  spaceUsedLabel: () => cy.get("[data-cy=label-space-used]"),
  spaceUsedProgressBar: () => cy.get("[data-cy=progress-bar-space-used]"),
  // mobile view only
  signOutButton: () => cy.get("[data-cy=button-sign-out]")
}
