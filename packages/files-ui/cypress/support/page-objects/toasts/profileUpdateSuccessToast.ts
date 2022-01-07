export const profileUpdateSuccessToast = {
  body: () => cy.get("[data-testid=toast-profile-update-success]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-toast-profile-update-success]")
}
