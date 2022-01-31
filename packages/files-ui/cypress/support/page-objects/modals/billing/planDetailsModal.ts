export const planDetailsModal = {
  body: () => cy.get("[data-testid=modal-container-planDetails]", { timeout: 10000 }),
  selectedPlanHeader: () => cy.get("[data-cy=header-selected-plan]"),
  selectedPlanSubheader: () => cy.get("[data-cy=label-selected-plan-subheader]"),
  featuresLabel: () => cy.get("[data-cy=label-features]"),
  storageDetailsLabel: () => cy.get("[data-cy=label-storage-details]"),
  billingLabel: () => cy.get("[data-cy=label-billing]"),
  billingStartDate: () => cy.get("[data-cy=label-billing-start-date]"),
  durationToggleSwitch: () => cy.get("[data-testid=toggle-switch-duration]"),
  totalCostLabel: () => cy.get("[data-cy=label-total-cost]"),
  selectThisPlanButton: () => cy.get("[data-testid=button-select-this-plan]"),
  goBackButton: () => cy.get("[data-testid=button-go-back-to-plan-selection]")
}
