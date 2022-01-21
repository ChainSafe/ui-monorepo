export const selectPlanModal = {
  body: () => cy.get("[data-testid=modal-container-select-plan]", { timeout: 10000 }),
  planBoxContainer: () => cy.get("[data-cy=container-plan-box]", { timeout: 10000 }),
  switchPlanHeader: () => cy.get("[data-cy=header-switch-plan]"),
  selectPlanButton: () => cy.get("[data-testid=button-select-plan]"),
  contactUsLink: () => cy.get("[data-cy=link-contact-us]"),
  planTitleLabel: () => cy.get("[data-cy=label-plan-title]"),
  FreePriceLabel: () => cy.get("[data-cy=label-no-charge]"),
  monthlyPriceLabel: () => cy.get("[data-cy=label-monthly-price]"),
  yearlyPriceLabel: () => cy.get("[data-cy=label-yearly-price]"),
  storageDescriptionLabel: () => cy.get("[data-cy=label-storage-capacity-amount]"),
  storageCapacityWarningLabel: () => cy.get("[data-cy=label-storage-capacity-warning]")
}
