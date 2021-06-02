import { basePage } from "./basePage"

export const settingsPage = {
  ...basePage,
  profileTabButton: () => cy.get("[data-testid=profile-tab]"),
  profileTabHeader: () => cy.get("[data-cy=settings-profile-header]"),
  firstNameInput: () => cy.get("[data-cy=profile-firstname-input]"),
  lastNameInput: () => cy.get("[data-cy=profile-lastname-input]"),
  saveChangesButton: () => cy.get("[data-cy=profile-save-button]"),
  securityTabButton: () => cy.get("[data-testid=security-tab]"),
  securityTabHeader: () => cy.get("[data-cy=settings-security-header]")
}
