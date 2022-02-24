export const recoverSuccessToast = {
  body: () => cy.get("[data-testid=toast-recover-success]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-recover-success]")
}
