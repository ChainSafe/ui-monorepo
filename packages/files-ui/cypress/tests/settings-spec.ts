import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { homePage } from "../support/page-objects/homePage"
// import { profileUpdateSuccessToast } from "../support/page-objects/toasts/profileUpdateSuccessToast"

describe("Settings", () => {
  context("desktop", () => {
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

    // it("save changes button should be disabled without first and last name", () => {
    //   settingsPage.signOutDropdown().should("be.visible")
    //   settingsPage.firstNameInput().clear()
    //   settingsPage.lastNameInput().clear()

    //   settingsPage.saveChangesButton().should("be.disabled")
    // })

    // it("can add/edit firstname and lastname", () => {
    //   settingsPage.signOutDropdown().should("be.visible")
    //   const newFirstName = "test first name"
    //   const newLastName = "test last name"

    //   settingsPage.firstNameInput().type(newFirstName)
    //   settingsPage.lastNameInput().type(`${newLastName}{enter}`)

    //   profileUpdateSuccessToast.body().should("be.visible")
    //   settingsPage.firstNameInput().should("have.value", newFirstName)
    //   settingsPage.lastNameInput().should("have.value", newLastName)
    // })

    // username from date
    const newUserName = Date.now().toString()

    it("can add a username", () => {
      settingsPage.signOutDropdown().should("be.visible")
      settingsPage.addUsernameButton().should("be.visible")
      settingsPage.addUsernameButton().click()
      settingsPage.usernameInput().should("be.visible")
      settingsPage.usernameInput().type(newUserName)
      settingsPage.setUsernameButton().should("be.enabled")
      settingsPage.setUsernameButton().safeClick()
      settingsPage.usernamePresentInput().should("be.visible")
      settingsPage.usernamePresentInput().should("be.disabled")
    })

    it("can navigate to settings security page", () => {
      settingsPage.securityTabButton().click()
      cy.url().should("include", "/settings")
      settingsPage.securityTabButton().click()
      cy.url().should("include", "/settings/security")
      settingsPage.securityTabHeader().should("be.visible")
    })
  })

  context("mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-6")
      cy.web3Login()
      homePage.hamburgerMenuButton().click()
      navigationMenu.settingsNavButton().click()
    })
    it("can navigate to the settings profile page on a phone", () => {
      settingsPage.profileTabButton().click()
      cy.url().should("include", "/settings/profile")
      settingsPage.profileTabHeader().should("be.visible")
    })

    it("can navigate to settings security page", () => {
      settingsPage.securityTabButton().click()
      cy.url().should("include", "/settings/security")
      settingsPage.securityTabHeader().should("be.visible")
    })
  })
})
