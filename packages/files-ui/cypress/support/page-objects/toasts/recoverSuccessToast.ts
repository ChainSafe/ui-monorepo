export const recoverSuccessToast = {
  body: () => cy.get("[data-testId=toast-recover-success]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testId=button-close-toast-recover-success]")
}
