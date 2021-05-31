export class NavigationMenu {

  homeNavButton() {
    return cy.get("[data-cy=home-nav]")
  }

  binNavButton() {
    return cy.get("[data-cy=bin-nav]")
  }

  settingsNavButton() {
    return cy.get("[data-cy=settings-nav]")
  }

  // Desktop view only elements
  spaceUsedLabel() {
    return cy.get("[data-cy=space-used-label]")
  }

  spaceUsedProgressBar() {
    return cy.get("[data-cy=space-used-progress-bar]")
  }

  sendFeedbackNavButton() {
    return cy.get("[data-cy=send-feedback-nav]")
  }

  // Mobile view only element
  signOutButton() {
    return cy.get("[data-cy=signout-nav]")
  }

}
