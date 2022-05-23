export const fileInfoModal = {
  body: () => cy.get("[data-cy=modal-container-info]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-cy=button-info-close]"),
  cidLabel: () => cy.get("[data-cy=label-info-cid]"),
  fileSizeLabel: () => cy.get("[data-cy=label-info-file-size]"),
  dateUploadedLabel: () => cy.get("[data-cy=label-info-date-uploaded]"),
  nameLabel: () => cy.get("[data-cy=label-info-name]"),
  decryptionKeyLabel: () => cy.get("[data-cy=label-info-decryption-key]")
}