import { NavigationMenu } from "../../support/page-objects/NavigationMenu"
import { SettingsPage } from "../../support/page-objects/SettingsPage"
import { HomePage } from "../../support/page-objects/HomePage"

const homePage = new HomePage()
const navigationMenu = new NavigationMenu()
const settingsPage = new SettingsPage()

describe("Development", () => {

  it("Andy experimental test", () => {

    cy.web3Login()
    navigationMenu.settingsNavButton().click()
    settingsPage.profileTabButton().click()

  })
})