import { authenticationPage } from "../support/page-objects/authenticationPage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { homePage } from "../support/page-objects/homePage"

describe("Main Navigation", () => {

  context("desktop", () => {
    beforeEach(() => {
      cy.web3Login()
    })

    it("can navigate to the bin page", () => {
      navigationMenu.binNavButton()
        .should("be.visible")
        .click()
      cy.url().should("include", "/bin")
    })

    it("can navigate to the settings page", () => {
      navigationMenu.settingsNavButton()
        .should("be.visible")
        .click()
      cy.url().should("include", "/settings")
    })

    it("can navigate to the home page", () => {
      navigationMenu.homeNavButton()
        .should("be.visible")
        .click()
      cy.url().should("include", "/drive")
    })
  })

  context("mobile", () => {
    beforeEach(() => {
      cy.web3Login()
    })

    beforeEach(() => {
      cy.viewport("iphone-6")
      homePage.hamburgerMenuButton()
        .should("be.visible")
        .click()
    })

    it("can navigate to the bin page", () => {
      navigationMenu.binNavButton()
        .should("be.visible")
        .click()
      cy.url().should("include", "/bin")
    })

    it("can navigate to the settings page", () => {
      navigationMenu.settingsNavButton()
        .should("be.visible")
        .click()
      cy.url().should("include", "/settings")
    })

    it("can navigate to the home page", () => {
      navigationMenu.homeNavButton()
        .should("be.visible")
        .click()
      cy.url().should("include", "/drive")
    })

    it("can sign out from the navigation bar", () => {
      navigationMenu.signOutButton()
        .should("be.visible")
        .click()
      authenticationPage.web3Button().should("be.visible")
      cy.url().should("not.include", "/drive")
      cy.url().should("not.include", "/bin")
      cy.url().should("not.include", "/settings")
    })
  })
})