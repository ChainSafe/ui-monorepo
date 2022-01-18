export const planDetailsModal = {
  body: () => cy.get("[data-testid=modal-container-plan-details]", { timeout: 10000 }),
  selectedPlanHeader: () => cy.get("[data-cy=header-selected-plan"),
  selectedPlanSubheader: () => cy.get("[data-cy=label-selected-plan-subheader"),
  featuresLabel: () => cy.get("[data-cy=label-features"),
  storageDetailsLabel: () => cy.get("[data-cy=label-storage-details"),
  billingLabel: () => cy.get("[data-cy=label-billing-section"),
  billingStartDate: () => cy.get("[data-cy=label-billing-start-date"),
  monthlyBillingLabel: () => cy.get("[data-cy=label-monthly-billing"),
  yearlyBillingLabel: () => cy.get("[data-cy=label-yearly-billing"),
  durationToggleSwitch: () => cy.get("[data-cy=toggle-switch-duration"),
  totalCostLabel: () => cy.get("[data-cy=label-total-cost"),
  selectThisPlanButton: () => cy.get("[data-testid=button-select-this-plan]"),
  goBackButton: () => cy.get("[data-testid=button-go-back-to-plan-selection]")
}
