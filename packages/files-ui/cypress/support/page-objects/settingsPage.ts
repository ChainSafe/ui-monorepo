import { basePage } from "./basePage"

export const settingsPage = {
  ...basePage,

  // profile tab
  profileTabButton: () => cy.get("[data-testid=tab-profile]"),
  profileTabHeader: () => cy.get("[data-cy=label-profile-header]"),
  firstNameInput: () => cy.get("[data-cy=input-profile-firstname]"),
  lastNameInput: () => cy.get("[data-cy=input-profile-lastname]"),
  saveChangesButton: () => cy.get("[data-cy=button-save-changes]"),
  addUsernameButton: () => cy.get("[data-cy=button-add-username]"),
  usernameInput: () => cy.get("[data-cy=input-profile-username]"),
  usernameErrorLabel: () => cy.get("[data-cy=input-profile-username] span.error"),
  setUsernameButton: () => cy.get("[data-cy=button-set-username]"),
  usernamePresentInput: () => cy.get("[data-cy=input-profile-username-present]"),

  // security tab
  securityTabButton: () => cy.get("[data-testid=tab-security]"),
  securityTabHeader: () => cy.get("[data-cy=label-security-header]"),

  // subscription tab
  subscriptionTabButton: () => cy.get("[data-testid=tab-subscription]"),
  planNameLabel: () => cy.get("[data-cy=label-plan-name]"),
  addCardButton: () => cy.get("[data-testid=button-add-a-card]"),
  updateCardButton: () => cy.get("[data-testid=button-update-a-card]"),
  defaultCardLabel: () => cy.get("[data-cy=label-default-card]"),
  noCardLabel: () => cy.get("[data-cy=label-no-card]"),
  removeCardLink: () => cy.get("[data-cy=link-remove-card]"),
  changePlanButton: () => cy.get("[data-cy=button-change-plan]", { timeout: 10000 })
}
