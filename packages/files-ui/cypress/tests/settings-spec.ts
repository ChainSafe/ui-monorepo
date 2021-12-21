import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { homePage } from "../support/page-objects/homePage"
import { profileUpdateSuccessToast } from "../support/page-objects/toasts/profileUpdateSuccessToast"

describe("Settings", () => {

  context("desktop", () => {

    describe("settings profile page", () => {
      beforeEach(() => {
        cy.web3Login()
        navigationMenu.settingsNavButton().click()
      })
      it("can navigate to settings profile page", () => {
        settingsPage.profileTabHeader().should("be.visible")
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

        profileUpdateSuccessToast.body().should("be.visible")
        settingsPage.firstNameInput().should("have.value", newFirstName)
        settingsPage.lastNameInput().should("have.value", newLastName)
      })

      // random username generation
      const newUserName = Buffer.from(Math.random().toString()).toString("base64").substr(10, 12)

      it("can add a username", () => {
        settingsPage.addUsernameButton().should("be.visible")
        settingsPage.addUsernameButton().click()
        settingsPage.usernameInput().should("be.visible")
        settingsPage.usernameInput().type(`${newUserName}`)
        settingsPage.setUsernameButton().should("be.enabled")
        settingsPage.setUsernameButton().safeClick()
        settingsPage.usernamePresentInput().should("be.visible")
        settingsPage.usernamePresentInput().should("be.disabled")
      })
    })

    describe("settings security page", () => {

      beforeEach(() => {
        cy.web3Login()
        navigationMenu.settingsNavButton().click()
      })

      it("can navigate to settings security page", () => {
        cy.url().should("include", "/settings")
        settingsPage.securityTabButton().click()
        cy.url().should("include", "/settings/security")
        settingsPage.securityTabHeader().should("be.visible")
      })
    })
  })

  context("mobile", () => {
    describe("settings profile page on phone", () => {
      beforeEach(() => {
        cy.viewport("iphone-6")
        cy.web3Login()
        homePage.hamburgerMenuButton().click()
        navigationMenu.homeNavButton().click()
        homePage.hamburgerMenuButton().click()
        navigationMenu.settingsNavButton().click()
        settingsPage.profileTabButton().click()
      })
      it("can navigate to the settings profile page on a phone", () => {
        settingsPage.profileTabHeader().should("be.visible")
        cy.url().should("include", "/settings")
        settingsPage.profileTabButton().click()
        cy.url().should("include", "/settings/profile")
        settingsPage.profileTabHeader().should("be.visible")
      })
    })

    describe("settings security page on phone", () => {
      beforeEach(() => {
        cy.viewport("iphone-6")
        cy.web3Login()
      })
      it("can navigate to settings security page", () => {
        homePage.hamburgerMenuButton().click()
        navigationMenu.settingsNavButton().click()
        settingsPage.securityTabButton().click()
        cy.url().should("include", "/settings/security")
        settingsPage.securityTabHeader().should("be.visible")
      })
    })
  })
})
