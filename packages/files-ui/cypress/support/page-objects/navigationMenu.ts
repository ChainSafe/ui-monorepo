import { basePage } from "./basePage"

export const navigationMenu = {
  ...basePage,
  homeNavButton: () => cy.get("[data-cy=link-home]"),
  binNavButton: () => cy.get("[data-cy=link-bin]"),
  settingsNavButton: () => cy.get("[data-cy=link-settings]"),
  sharedNavButton: () => cy.get("[data-cy=link-shared]"),
  spaceUsedLabel: () => cy.get("[data-cy=label-space-used]", { timeout: 10000 }),
  spaceUsedProgressBar: () => cy.get("[data-cy=progress-bar-space-used]"),
  reportABugButton: () => cy.get("[data-cy=button-report-bug]"),
  // mobile view only
  signOutButton: () => cy.get("[data-cy=container-signout-nav]")
}
