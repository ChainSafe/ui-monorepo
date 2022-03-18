export const shareSuccessToast = {
  body: () => cy.get("[data-testid=toast-share-success]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-share-success]")
}
