import { NavigationMenu } from "../support/page-objects/NavigationMenu"
import { HomePage } from "../support/page-objects/HomePage"
import { landingPage } from "../support/page-objects/LandingPage"

const homePage = new HomePage()
const navigationMenu = new NavigationMenu()

describe("Main Navigation", () => {

  context("desktop", () => {
    before(() => {
      cy.web3Login()
    })

    it("can navigate to the bin page", () => {
      navigationMenu.binNavButton().click()
      cy.url().should("include", "/bin")
    })

    it("can navigate to the settings page", () => {
      navigationMenu.settingsNavButton().click()
      cy.url().should("include", "/settings")
    })

    it("can see data storage summary info", () => {
      navigationMenu.spaceUsedLabel().should("contain.text", "of 20 GB used")
      navigationMenu.spaceUsedProgressBar().should("be.visible").should
    })

    it.skip("can navigate to block survey via send feedback button", () => {
      // TODO: Andrew - find a way to check the button link, cypress doesn't support tabs
    })

    it("can navigate to the home page", () => {
      navigationMenu.homeNavButton().click()
      cy.url().should("include", "/drive")
    })
  })

  context("mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-6")
    })
    before(() => {
      cy.web3Login()
    })

    it("can navigate to the bin page", () => {
      homePage.hamburgerMenuButton().click()
      navigationMenu.binNavButton().click()
      cy.url().should("include", "/bin")
    })

    it("can navigate to the settings page", () => {
      homePage.hamburgerMenuButton().click()
      navigationMenu.settingsNavButton().click()
      cy.url().should("include", "/settings")
    })

    it("can navigate to the home page", () => {
      homePage.hamburgerMenuButton().click()
      navigationMenu.homeNavButton().click()
      cy.url().should("include", "/drive")
    })

    it("can sign out from the navigation bar", () => {
      homePage.hamburgerMenuButton().click()
      navigationMenu.signOutButton().click()
      landingPage.web3Button().should("be.visible")
      cy.url().should("not.include", "/drive")
      cy.url().should("not.include", "/bin")
      cy.url().should("not.include", "/settings")
    })
  })
})
