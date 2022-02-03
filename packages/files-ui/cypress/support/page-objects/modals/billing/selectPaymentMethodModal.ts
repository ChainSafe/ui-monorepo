export const selectPaymentMethodModal = {
  body: () => cy.get("[data-testid=modal-container-paymentMethod]", { timeout: 10000 }),
  selectPaymentHeader: () => cy.get("[data-cy=header-select-payment]"),
  addCardTextButton: () => cy.get("[data-cy=text-button-add-card]"),
  updateCardTextButton: () => cy.get("[data-cy=text-button-update-card]"),
  creditCardRadioInput: () => cy.get("[data-testid=radio-input-credit-card]"),
  cryptoRadioInput: () => cy.get("[data-testid=radio-input-crypto]"),
  selectPaymentButton: () => cy.get("[data-testid=button-select-payment-method]"),
  goBackButton: () => cy.get("[data-testid=button-go-back-to-plan-details]"),

  // elements only displayed when adding a card
  cardNumberInput: () => cy.getWithinIframe("[data-elements-stable-field-name=cardNumber]", "#iframe-card-number iframe"),
  cvcNumberInput: () => cy.getWithinIframe("[data-elements-stable-field-name=cardCvc]", "#iframe-card-cvc iframe"),
  expiryDateInput: () => cy.getWithinIframe("[data-elements-stable-field-name=cardExpiry]", "#iframe-card-expiry iframe"),
  useThisCardButton: () => cy.get("[data-testid=button-add-card]")
}