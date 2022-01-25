export const confirmPlanChangeModal = {
  body: () => cy.get("[data-testid=modal-container-confirmPlan]", { timeout: 10000 }),

  confirmPlanHeader: () => cy.get("[data-cy=header-confirm-change]"),

  selectedPlanLabel: () => cy.get("[data-cy=link-edit-plan"),
  editPlanLink: () => cy.get("[data-cy=link-edit-plan"),
  featuresLabel: () => cy.get("[data-cy=label-features-title"),
  featuresSummaryLabel: () => cy.get("[data-cy=label-features-summary"),

  selectedPaymentMethodLabel: () => cy.get("[data-cy=label-selected-payment-method"),
  cardNumberLabel: () => cy.get("[data-cy=selected-card-number"),
  editPaymentMethodLink: () => cy.get("[data-cy=link-edit-payment-method"),
  billingLabel: () => cy.get("[data-cy=label-billing-title"),
  billingStartDate: () => cy.get("[data-cy=label-billing-start-date"),
  totalLabel: () => cy.get("[data-cy=label-total-title"),
  totalPriceLabel: () => cy.get("[data-cy=label-total-price"),
  changePlanErrorLabel: () => cy.get("[data-cy=label-change-plan-error"),
  goBackButton: () => cy.get("[data-testid=button-go-back-to-payment-method"),
  confirmPlanChangeButton: () => cy.get("[data-testid=button-confirm-plan-change")
}