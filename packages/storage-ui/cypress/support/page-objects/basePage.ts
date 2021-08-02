// Only add things here that could be applicable to all / most pages

export const basePage = {
  signOutDropdown: () => cy.get("[data-testid=dropdown-title-sign-out]"),
  signOutMenuOption: () => cy.get("[data-cy=menu-sign-out]"),
  // Mobile view only element
  hamburgerMenuButton: () => cy.get("[data-testId=hamburger-menu]")
}
