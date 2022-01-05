export const uploadCompleteToast = {
  body: () => cy.get("[data-testId=toast-upload-complete]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testId=button-close-toast-upload-complete]")
}
