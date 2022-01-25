export const selectPaymentMethodModal = {
  body: () => cy.get("[data-testid=modal-container-paymentMethod]", { timeout: 10000 }),
  selectPaymentHeader: () => cy.get("[data-cy=header-select-payment]"),
  addCardTextButton: () => cy.get("[data-cy=text-button-add-card]"),
  updateCardTextButton: () => cy.get("[data-cy=text-button-update-card]"),
  creditCardRadioInput: () => cy.get("[data-testid=radio-input-credit-card]"),
  cryptoRadioInput: () => cy.get("[data-testid=radio-input-crypto]"),
  selectPaymentButton: () => cy.get("[data-testid=button-select-payment-method]"),
  goBackButton: () => cy.get("[data-testid=button-go-back-to-plan-details]")
}