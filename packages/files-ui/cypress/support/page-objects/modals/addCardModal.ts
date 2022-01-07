export const addCardModal = {
  body: () => cy.get("[data-cy=modal-add-card]", { timeout: 10000 }),
  addCardButton: () => cy.get("[data-cy=button-add-card]"),
  cancelButton: () => cy.get("[data-cy=button-cancel-add-card]"),
  cardErrorLabel: () => cy.get("[data-cy=label-add-card-error]"),
  //   cardNumberInput: () => cy.get("[data-cy=input-card-number]"),
  cardNumberInput: () => cy.get(".makeStyles-cardNumberInputs-477"),
  createButton: () => cy.get("[data-cy=button-add-card]", { timeout: 10000 }),
  //   cvcNumberInput: () => cy.get("[data-cy=input-cvc-number]"),
  //   expiryDateInput: () => cy.get("[data-cy=input-expiry-date]")
  cvcNumberInput: () => cy.get(".makeStyles-expiryCvcContainer-480 > :nth-child(2)"),
  expiryDateInput: () => cy.get(".makeStyles-expiryCvcContainer-480 > :nth-child(1)")
}
