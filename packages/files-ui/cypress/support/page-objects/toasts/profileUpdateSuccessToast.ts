export const profileUpdateSuccessToast = {
  body: () => cy.get("[data-testId=toast-profile-update-success]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testId=button-close-toast-profile-update-success]")
}
