// Only add things here that could be applicable to all / most pages

export const basePage = {
  cidsHeaderLabel: () => cy.get("[data-cy=cids-header]", { timeout: 20000 }),
  bucketsHeaderLabel: () => cy.get("[data-cy=buckets-header]", { timeout: 20000 }),

  // Mobile view only element
  hamburgerMenuButton: () => cy.get("[data-testId=hamburger-menu]")
}
