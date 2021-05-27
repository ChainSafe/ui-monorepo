import { BasePage } from "./BasePage"

export class SettingsPage extends BasePage {

  // Elements 
  profileTabButton() {
    return cy.get(".profile")
  }

  securityTabButton() {
    return cy.get(".security")
  }

  securityTabHeader() {
    return cy.get("[data-cy=settings-security-header")
  }

  profileTabHeader() {
    return cy.get("[data-cy=settings-profile-header")
  }

  // Page helpers

}
