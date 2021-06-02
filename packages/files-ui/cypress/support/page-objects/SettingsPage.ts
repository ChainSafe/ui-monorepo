import { BasePage } from "./BasePage"

export class SettingsPage extends BasePage {

  profileTabButton() {
    return cy.get("[data-testid=profile-tab]")
  }

  profileTabHeader() {
    return cy.get("[data-cy=settings-profile-header")
  }

  firstNameInput() {
    return cy.get("data-cy=profile-firstname-input")
  }

  lastNameInput() {
    return cy.get("data-cy=profile-lastname-input")
  }

  saveChangesButton() {
    return cy.get("data-cy=profile-save-button")
  }

  securityTabButton() {
    return cy.get("[data-testid=security-tab]")
  }

  securityTabHeader() {
    return cy.get("[data-cy=settings-security-header")
  }

}
