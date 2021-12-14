import { basePage } from "./basePage"

export const settingsPage = {
  ...basePage,
  profileTabButton: () => cy.get("[data-testid=tab-profile]"),
  profileTabHeader: () => cy.get("[data-cy=label-profile-header]"),
  firstNameInput: () => cy.get("[data-cy=input-profile-firstname]"),
  lastNameInput: () => cy.get("[data-cy=input-profile-lastname]"),
  saveChangesButton: () => cy.get("[data-cy=button-save-changes]"),
  securityTabButton: () => cy.get("[data-testid=tab-security]"),
  securityTabHeader: () => cy.get("[data-cy=label-security-header]"),
  subscriptionTabButton: () => cy.get("[data-testid=tab-subscription]")
}
