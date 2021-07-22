import { navigationMenu } from "../support/page-objects/navigationMenu"
import { cidsPage } from "../support/page-objects/cidsPage"

describe("Main Navigation", () => {

  context("desktop", () => {
    before(() => {
      cy.web3Login()
    })

    it("can navigate to the cids page", () => {
      navigationMenu.cidsNavButton().click()
      cy.url().should("include", "/cids")
    })
  })

  context("mobile", () => {
    before(() => {
      cy.web3Login()
    })

    beforeEach(() => {
      cy.viewport("iphone-6")
      cidsPage.hamburgerMenuButton().click()
    })

    it("can navigate to the cids page", () => {
      navigationMenu.cidsNavButton().click()
      cy.url().should("include", "/cids")
    })
  })
})
