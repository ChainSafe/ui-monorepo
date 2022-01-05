export const moveSuccessToast = {
  body: () => cy.get("[data-testId=toast-move-success]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testId=button-close-toast-move-success]")
}
