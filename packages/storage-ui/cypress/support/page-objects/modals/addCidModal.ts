export const addCidModal = {
  body: () => cy.get("[data-testid=modal-container-add-cid]", { timeout: 10000 }),
  nameInput: () => cy.get("[data-cy=input-cid-name]"),
  cidInput: () => cy.get("[data-cy=input-cid]"),
  cidPinnedWarningLabel: () => cy.get("[data-cy=label-cid-pinned-warning]", { timeout: 2000 }),
  pinCancelButton: () => cy.get("[data-cy=button-cancel-add-pin]"),
  pinSubmitButton: () => cy.get("[data-cy=button-submit-pin]")
}
