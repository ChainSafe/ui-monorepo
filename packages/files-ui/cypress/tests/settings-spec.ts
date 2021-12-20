import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { homePage } from "../support/page-objects/homePage"

describe("Settings", () => {

  context("desktop", () => {
    beforeEach(() => {
      cy.web3Login({ withNewUser: true, saveBrowser: false })
    })

    describe("settings profile page", () => {
      beforeEach(() => {
        navigationMenu.settingsNavButton().click()
        settingsPage.profileTabHeader().should("be.visible")
      })

      it("can navigate to settings profile page", () => {
        cy.url().should("include", "/settings")
        settingsPage.profileTabButton().click()
        cy.url().should("include", "/settings/profile")
        settingsPage.profileTabHeader().should("be.visible")
      })

      it("save changes button should be disabled without first and last name", () => {
        settingsPage.firstNameInput().clear()
        settingsPage.lastNameInput().clear()

        settingsPage.saveChangesButton().should("be.disabled")
      })

      it("can add/edit firstname and lastname", () => {
        const newFirstName = "test first name"
        const newLastName = "test last name"

        settingsPage.firstNameInput().type(newFirstName)
        settingsPage.lastNameInput().type(`${newLastName}{enter}`)

        settingsPage.firstNameInput().should("have.value", newFirstName)
        settingsPage.lastNameInput().should("have.value", newLastName)

        settingsPage.saveChangesButton().safeClick()
        settingsPage.firstNameInput().should("have.value", newFirstName)
        settingsPage.lastNameInput().should("have.value", newLastName)
      })
    })

    describe("settings security page", () => {
      it("can navigate to settings security page", () => {
        navigationMenu.settingsNavButton().click()
        cy.url().should("include", "/settings")
        settingsPage.securityTabButton().click()
        cy.url().should("include", "/settings/security")
        settingsPage.securityTabHeader().should("be.visible")
      })
    })
  })

  context("mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-6")
    })

    beforeEach(() => {
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
