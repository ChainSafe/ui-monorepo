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

  spaceUsedLabel() {
    return cy.get("[data-cy=space-used-label]")
  }

  spaceUsedProgressBar() {
    return cy.get("[data-cy=space-used-progress-bar]")
  }

  sendFeedbackNavButton() {
    return cy.get("[data-cy=send-feedback-nav]")
  }

}