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

    it("can navigate to the API keys page", () => {
      navigationMenu.apiKeysNavButton().click()
      cy.url().should("include", "/api-keys")
    })

    it("can sign out from the navigation bar", () => {
      navigationMenu.signOutDropdown().click()
      navigationMenu.signOutMenuOption()
        .should("be.visible")
        .click()
      authenticationPage.web3Button().should("be.visible")
      cy.url().should("not.include", "/buckets")
      cy.url().should("not.include", "/cids")
      cy.url().should("not.include", "/api-keys")
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

    it("can navigate to the API keys page", () => {
      navigationMenu.apiKeysNavButton().click()
      cy.url().should("include", "/api-keys")
    })

    it("can sign out from the navigation bar", () => {
      navigationMenu.signOutButton()
        .should("be.visible")
        .click()
      authenticationPage.web3Button().should("be.visible")
      cy.url().should("not.include", "/buckets")
      cy.url().should("not.include", "/cids")
      cy.url().should("not.include", "/api-keys")
    })
  })
})
