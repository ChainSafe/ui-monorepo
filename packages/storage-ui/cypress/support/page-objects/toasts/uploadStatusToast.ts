export const uploadStatusToast = {
  body: () => cy.get("[data-cy=upload_status_toast_message]", { timeout: 20000 })
}
