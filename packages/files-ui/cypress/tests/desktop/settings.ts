import { NavigationMenu } from "../../support/page-objects/NavigationMenu"
import { SettingsPage } from "../../support/page-objects/SettingsPage"
import { HomePage } from "../../support/page-objects/HomePage"

const homePage = new HomePage()
const navigationMenu = new NavigationMenu()
const settingsPage = new SettingsPage()

describe("Settings", () => {
  it("can navigate to the settings profile page", () => {
    cy.web3Login()
    navigationMenu.settingsNavButton().click()
    settingsPage.profileTabHeader().should("be.visible")
    cy.url().should("include", "/settings")
    settingsPage.profileTabButton().click()
    cy.url().should("include", "/settings/profile")
    settingsPage.profileTabHeader().should("be.visible")
    settingsPage.securityTabButton().click()
    cy.url().should("include", "/settings/security")
    settingsPage.securityTabHeader().should("be.visible")
  })

  it("can navigate to the settings security page on a phone", () => {
    cy.viewport("iphone-6")
    cy.web3Login()
    homePage.hamburgerMenuButton().click()
    navigationMenu.settingsNavButton().click()
    settingsPage.profileTabHeader().should("not.exist")
    cy.url().should("include", "/settings")
    settingsPage.profileTabButton().click()
    cy.url().should("include", "/settings/profile")
    settingsPage.profileTabHeader().should("be.visible")
    cy.go("back")
    settingsPage.securityTabButton().click()
    cy.url().should("include", "/settings/security")
    settingsPage.securityTabHeader().should("be.visible")
  })
})
