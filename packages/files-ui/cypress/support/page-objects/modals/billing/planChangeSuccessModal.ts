export const planChangeSuccessModal = {
  body: () => cy.get("[data-testid=modal-container-planSuccess]", { timeout: 10000 }),
  confirmationHeader: () => cy.get("[data-cy=header-plan-change-success]"),
  planChangeSuccessSubheader: () => cy.get("[data-cy=label-plan-changed-successfully]"),
  featuresSummaryLabel: () => cy.get("[data-cy=label-features-summary-title]"),
  newStorageCapacityLabel: () => cy.get("[data-cy=label-new-plan-capacity]"),
  newPlanNameLabel: () => cy.get("[data-cy=label-new-plan-name]"),
  billingHistoryLabel: () => cy.get("[data-cy=label-billing-history-notice]"),
  invoicesLink: () => cy.get("[data-cy=link-view-invoices]"),
  closeButton: () => cy.get("[data-testid=button-close-success-modal]")
}