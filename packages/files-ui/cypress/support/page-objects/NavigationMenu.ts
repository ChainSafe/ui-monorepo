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

  sendFeedbackNavButton() {
    return cy.get("[data-cy=send-feedback-nav]")
  }

}