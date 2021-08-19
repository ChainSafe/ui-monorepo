// Only add things here that could be applicable to all / most pages

export const basePage = {
  appHeaderLabel: () => cy.get("[data-cy=files-app-header]", { timeout: 20000 }),
  signOutDropdown: () => cy.get("[data-testid=menu-title-sign-out]"),
  signOutMenuOption: () => cy.get("[data-cy=menu-sign-out]"),
  // Mobile view only element
  hamburgerMenuButton: () => cy.get("[data-testId=hamburger-menu]")
}
