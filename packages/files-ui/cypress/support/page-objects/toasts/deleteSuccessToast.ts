export const deleteSuccessToast = {
  body: () => cy.get("[data-testId=toast-deletion-success]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testId=button-close-toast-deletion-success]")
}
