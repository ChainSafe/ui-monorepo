export class NavigationMenu {

  homeNavButton() {
    return cy.get("[data-cy=nav-home]")
  }

  binNavButton() {
    return cy.get("[data-cy=nav-bin]")
  }

  settingsNavButton() {
    return cy.get("[data-cy=nav-settings]")
  }

  sendFeedbackNavButton() {
    return cy.get("[data-cy=nav-feedback]")
  }

}