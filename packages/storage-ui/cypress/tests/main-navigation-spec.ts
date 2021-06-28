import { navigationMenu } from "../support/page-objects/navigationMenu"
import { homePage } from "../support/page-objects/homePage"

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
      homePage.hamburgerMenuButton().click()
    })

    it("can navigate to the cids page", () => {
      navigationMenu.cidsNavButton().click()
      cy.url().should("include", "/cids")
    })
  })
})
