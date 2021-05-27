import { BasePage } from "./BasePage"

export class SettingsPage extends BasePage {

  // Elements 
  profileTabButton() {
    return cy.get("[data-testid=profile-tab]")
  }

  profileTabHeader() {
    return cy.get("[data-cy=settings-profile-header")
  }

  FirstNameInput() {
    return cy.get("data-cy=profile-firstname-input")
  }

  LastNameInput() {
    return cy.get("data-cy=profile-firstname-input")
  }

  SaveChangesButton() {
    return cy.get("data-cy=profile-save-button")
  }

  securityTabButton() {
    return cy.get("[data-testid=security-tab]")
  }

  securityTabHeader() {
    return cy.get("[data-cy=settings-security-header")
  }

  // Page helpers

}
