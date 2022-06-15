import { navigationMenu } from "../support/page-objects/navigationMenu"
import { cidsPage } from "../support/page-objects/cidsPage"
import { authenticationPage } from "../support/page-objects/authenticationPage"

describe("Main Navigation", () => {

  context("desktop", () => {
    beforeEach(() => {
      cy.web3Login()
    })

    it("can navigate to the cids page", () => {
      navigationMenu.cidsNavButton().click()
      cy.url().should("include", "/cids")
    })

    it("can navigate to the buckets page", () => {
      navigationMenu.bucketsNavButton().click()
      cy.url().should("include", "/buckets")
    })

    it("can navigate to the settings page", () => {
      navigationMenu.settingsNavButton().click()
      cy.url().should("include", "/settings")
    })

    it("can navigate to the docs page", () => {
      navigationMenu.docsNavButton().invoke("removeAttr", "target").click()
      cy.url().should("eq", "https://docs.storage.chainsafe.io/")
    })

    it("can sign out from the navigation bar", () => {
      navigationMenu.signOutDropdown().click()
      navigationMenu.signOutMenuOption()
        .should("be.visible")
        .click()
      authenticationPage.web3Button().should("be.visible")
      cy.url().should("not.include", "/drive")
      cy.url().should("not.include", "/bin")
      cy.url().should("not.include", "/settings")
    })
  })

  context("mobile", () => {
    beforeEach(() => {
      cy.web3Login()
      cy.viewport("iphone-6")
      cidsPage.hamburgerMenuButton().click()
    })

    it("can navigate to the cids page", () => {
      navigationMenu.cidsNavButton().click()
      cy.url().should("include", "/cids")
    })

    it("can navigate to the buckets page", () => {
      navigationMenu.bucketsNavButton().click()
      cy.url().should("include", "/buckets")
    })

    it("can navigate to the settings page", () => {
      navigationMenu.settingsNavButton().click()
      cy.url().should("include", "/settings")
    })

    it("can navigate to the docs page", () => {
      navigationMenu.docsNavButton().invoke("removeAttr", "target").click()
      cy.url().should("eq", "https://docs.storage.chainsafe.io/")
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
