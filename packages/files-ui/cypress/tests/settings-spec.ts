import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { homePage } from "../support/page-objects/homePage"

describe("Settings", () => {

  context("desktop", () => {
    before(() => {
      cy.web3Login()
    })

    it("can navigate to the settings profile page", () => {
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
  })

  context("mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-6")
    })

    before(() => {
      cy.web3Login()
    })

    it("can navigate to the settings security page on a phone", () => {
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
})
