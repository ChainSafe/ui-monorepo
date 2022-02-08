export const downgradeDetailsModal = {
  body: () => cy.get("[data-testid=modal-container-downgradeDetails]", { timeout: 10000 }),
  downgradePlanHeader: () => cy.get("[data-cy=header-downgrade-plan]"),
  lostFeaturesSummaryLabel: () => cy.get("[data-cy=label-lost-features-summary]"),
  downgradedStorageLabel: () => cy.get("[data-cy=label-downgraded-storage-description]"),
  downgradePaymentWarningLabel: () => cy.get("[data-cy=label-downgrade-payment-warning]"),
  goBackButton: () => cy.get("[data-testid=button-go-back-to-plan-selection]"),
  switchToFreePlanButton: () => cy.get("[data-testid=button-switch-to-free-plan]"),
  switchPlanButton: () => cy.get("[data-testid=button-switch-plan]")
}