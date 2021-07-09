import { basePage } from "./basePage"

export const navigationMenu = {
  ...basePage,
  homeNavButton: () => cy.get("[data-cy=home-nav]"),
  settingsNavButton: () => cy.get("[data-cy=settings-nav]")
  // spaceUsedLabel: () => cy.get("[data-cy=space-used-label]"),
  // spaceUsedProgressBar: () => cy.get("[data-cy=space-used-progress-bar]"),
  // sendFeedbackNavButton: () => cy.get("[data-cy=send-feedback-nav]"),
  // signOutButton: () => cy.get("[data-cy=signout-nav]")
}
