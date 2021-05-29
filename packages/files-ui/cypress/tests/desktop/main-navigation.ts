import { NavigationMenu } from "../../support/page-objects/NavigationMenu"

const navigationMenu = new NavigationMenu()

describe("Main Navigation", () => {
  before(() => {
    cy.web3Login()
  })

  it("can navigate to the home page", () => {
    navigationMenu.homeNavButton().click()
    cy.url().should("include", "/drive")

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

//   it("can navigate to block survey via send feedback button", () => {
//     // TODO: find a way to check button link, cypress doesn't support tabs
//   })

})