export class BasePage {

  // Only add things here that could be applicable to any (most!) pages

  hamburgerMenuButton() {
    return cy.get("[data-testId=hamburger-menu]")
  }

}
