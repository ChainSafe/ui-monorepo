export const linkSharingConfirmation = {
  browseButton: () => cy.get("[data-cy=button-browse-share-folder]", { timeout: 10000 }),
  linkErrorMessage: () => cy.get("[data-cy=label-other-error-message]", { timeout: 10000 }),
  invalidLinkMessage: () => cy.get("[data-cy=label-invalid-link]", { timeout: 10000 }),
  editAccessConfirmationLabel: () => cy.get("[data-cy=label-share-confirmation-write-access", { timeout: 10000 }),
  viewAccessConfirmationLabel: () => cy.get("[data-cy=label-share-confirmation-read-access", { timeout: 10000 }),
  ErrorIcon: () => cy.get("[data-cy=icon-link-error", { timeout: 10000 })
}
