export const cryptoPaymentModal = {
  body: () => cy.get("[data-testid=modal-container-cryptoPayment]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-modal-cryptoPayment]"),
  payWithCryptoHeader: () => cy.get("[data-cy=header-pay-with-crypto]"),
  cryptoPaymentTimer: () => cy.get("[data-cy=container-crypto-time-remaining]"),
  totalLabel: () => cy.get("[data-cy=label-total-crypto-title]", { timeout: 10000 }),
  totalPriceLabel: () => cy.get("[data-cy=label-total-crypto-price]"),
  crypoPaymentErrorLabel: () => cy.get("[data-cy=label-crypto-payment-error]"),
  selectCryptocurrencyLabel: () => cy.get("[data-cy=label-select-cryptocurrency]"),
  cryptoPaymentButton: () => cy.get("[data-cy=container-crypto-payment-option]"),

  // elements below only shown after crypto payment button has been clicked
  receivingQrCodeContainer: () => cy.get("[data-cy=container-qr-code]"),
  currencyTypeWarning: () => cy.get("[data-cy=label-currency-type-warning]"),
  destinationAddressLabelTitle: () => cy.get("[data-cy=label-destination-address-title]"),
  destinationAddressLabel: () => cy.get("[data-cy=label-destination-address]"),
  cryptoAmountTitleLabel: () => cy.get("[data-cy=label-crypto-amount-title]"),
  cryptoAmountLabel: () => cy.get("[data-cy=label-crypto-amount]"),
  crypoFinalSaleWarningLabel: () => cy.get("[data-cy=label-crypto-final-sale-warning]"),
  goBackButton: () => cy.get("[data-testid=button-go-back-to-crypto-selection]"),
  switchNetworkButton: () => cy.get("[data-testid=button-switch-network]"),
  connectWalletButton: () => cy.get("[data-testid=button-connect-wallet]")
}

