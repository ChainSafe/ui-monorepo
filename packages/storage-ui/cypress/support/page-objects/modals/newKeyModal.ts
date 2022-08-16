export const newKeyModal = {
  keyIdLabel: () => cy.get("[data-cy=label-new-key-modal-key-id]"),
  secretLabel: () => cy.get("[data-cy=label-new-key-modal-secret]"),
  closeButton: () => cy.get("[data-cy=button-new-key-modal-close]")
}
