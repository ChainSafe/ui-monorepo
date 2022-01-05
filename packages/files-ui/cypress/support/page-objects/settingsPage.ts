import { basePage } from "./basePage"

export const settingsPage = {
  ...basePage,
  profileTabButton: () => cy.get("[data-testId=tab-profile]"),
  profileTabHeader: () => cy.get("[data-cy=label-profile-header]"),
  firstNameInput: () => cy.get("[data-cy=input-profile-firstname]"),
  lastNameInput: () => cy.get("[data-cy=input-profile-lastname]"),
  saveChangesButton: () => cy.get("[data-cy=button-save-changes]"),
  addUsernameButton: () => cy.get("[data-cy=button-add-username]"),
  usernameInput: () => cy.get("[data-cy=input-profile-username]"),
  usernameErrorLabel: () => cy.get("[data-cy=input-profile-username] span.error"),
  setUsernameButton: () => cy.get("[data-cy=button-set-username]"),
  usernamePresentInput: () => cy.get("[data-cy=input-profile-username-present]"),
  securityTabButton: () => cy.get("[data-testId=tab-security]"),
  securityTabHeader: () => cy.get("[data-cy=label-security-header]"),
  subscriptionTabButton: () => cy.get("[data-testId=tab-subscription]")
}
