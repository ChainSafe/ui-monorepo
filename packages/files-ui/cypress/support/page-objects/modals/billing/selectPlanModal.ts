export const selectPlanModal = {
  body: () => cy.get("[data-testid=modal-container-select]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-testid=button-close-modal-container-select]"),
  planBoxContainer: () => cy.get("[data-cy=container-plan-box]", { timeout: 10000 }),
  switchPlanHeader: () => cy.get("[data-cy=header-switch-plan]"),
  selectPlanButton: () => cy.get("[data-testid=button-select-plan]"),
  contactUsLink: () => cy.get("[data-cy=link-contact-us]"),
  planTitleLabel: () => cy.get("[data-cy=label-plan-title]"),
  FreePriceLabel: () => cy.get("[data-cy=label-no-charge]"),
  monthlyPriceLabel: () => cy.get("[data-cy=label-monthly-price]"),
  yearlyPriceLabel: () => cy.get("[data-cy=label-yearly-price]"),
  storageDescriptionLabel: () => cy.get("[data-cy=label-storage-capacity-amount]"),
  storageCapacityWarningLabel: () => cy.get("[data-cy=label-storage-capacity-warning]"),

  // creates a cypress alias for each individual plan.
  createPlanCypressAliases() {
    this.planBoxContainer().should("have.length.greaterThan", 0)
    this.planBoxContainer().contains("Free plan")
      .should("be.visible")
      .as("freePlanBox")
    this.planBoxContainer().contains("Standard plan")
      .should("be.visible")
      .as("standardPlanBox")
    this.planBoxContainer().contains("Premium plan")
      .should("be.visible")
      .as("premiumPlanBox")
  }
}
