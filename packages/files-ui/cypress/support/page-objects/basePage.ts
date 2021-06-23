// Only add things here that could be applicable to all / most pages

export const basePage = {
  appHeaderLabel: () => cy.get("[data-cy=files-app-header]", { timeout: 20000 }),

  // Mobile view only element
  hamburgerMenuButton: () => cy.get("[data-testId=hamburger-menu]")
}
