export class BasePage {

  // Only add things here that could be applicable to all / most pages

  // Mobile view only element
  hamburgerMenuButton() {
    return cy.get("[data-testId=hamburger-menu]")
  }

}
