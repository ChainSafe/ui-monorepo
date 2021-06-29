import { basePage } from "./basePage"

export const navigationMenu = {
  ...basePage,
  homeNavButton: () => cy.get("[data-cy=home-nav]"),
  cidsNavButton: () => cy.get("[data-cy=cids-nav]"),
  bucketsNavButton: () => cy.get("[data-cy=buckets-nav]"),
  settingsNavButton: () => cy.get("[data-cy=settings-nav]")
  // spaceUsedLabel: () => cy.get("[data-cy=space-used-label]"),
  // spaceUsedProgressBar: () => cy.get("[data-cy=space-used-progress-bar]"),
  // sendFeedbackNavButton: () => cy.get("[data-cy=send-feedback-nav]"),
  // signOutButton: () => cy.get("[data-cy=signout-nav]")
}
