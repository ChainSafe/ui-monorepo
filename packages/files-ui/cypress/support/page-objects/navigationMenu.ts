import { basePage } from "./basePage"

export const navigationMenu = {
  ...basePage,
  homeNavButton: () => cy.get("[data-cy=home-nav]"),
  binNavButton: () => cy.get("[data-cy=bin-nav]"),
  settingsNavButton: () => cy.get("[data-cy=settings-nav]"),
  spaceUsedLabel: () => cy.get("[data-cy=label-space-used]"),
  spaceUsedProgressBar: () => cy.get("[data-cy=progress-bar-space-used]"),
  sendFeedbackNavButton: () => cy.get("[data-cy=send-feedback-nav]"),
  // mobile view only
  signOutButton: () => cy.get("[data-cy=signout-nav]")
}
