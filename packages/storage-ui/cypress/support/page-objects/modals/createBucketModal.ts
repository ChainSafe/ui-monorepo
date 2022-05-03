export const createBucketModal = {
  body: () => cy.get("[data-testid=modal-container-create-bucket]", { timeout: 10000 }),
  bucketNameInput: () => cy.get("[data-cy=input-bucket-name]"),
  chainsafeRadioInput: () => cy.get("[data-testid=radio-input-chainsafe]"),
  ipfsRadioInput: () => cy.get("[data-testid=radio-input-ipfs]"),
  cancelButton: () => cy.get("[data-cy=button-cancel-create]"),
  submitButton: () => cy.get("[data-cy=button-submit-create]")
}
