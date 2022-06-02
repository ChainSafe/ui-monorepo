import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { homePage } from "../support/page-objects/homePage"
import { complexPassword, simplePassword } from "../fixtures/filesTestData"
// import { profileUpdateSuccessToast } from "../support/page-objects/toasts/profileUpdateSuccessToast"

describe("Settings", () => {
  context("desktop", () => {

    it("can navigate to settings profile page", () => {
      cy.web3Login()
      navigationMenu.settingsNavButton().click()
      settingsPage.profileTabHeader().should("be.visible")
      cy.url().should("include", "/settings")
      settingsPage.profileTabButton().click()
      cy.url().should("include", "/settings/profile")
      settingsPage.profileTabHeader().should("be.visible")
    })

    // it("save changes button should be disabled without first and last name", () => {
    //   cy.web3Login()
    //   navigationMenu.settingsNavButton().click()
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
      cy.web3Login({ withNewSession: true })
      navigationMenu.settingsNavButton().click()
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
      cy.web3Login()
      navigationMenu.settingsNavButton().click()
      settingsPage.securityTabButton().click()
      cy.url().should("include", "/settings")
      settingsPage.securityTabButton().click()
      cy.url().should("include", "/settings/security")
      settingsPage.securityTabHeader().should("be.visible")
    })

    it("can change the account password", () => {
      cy.web3Login({ withNewSession: true })
      navigationMenu.settingsNavButton().click()
      settingsPage.securityTabButton().click()
      settingsPage.securityTabButton().click()
      settingsPage.changePasswordLink().click()

      // change password
      settingsPage.passwordInput().type(complexPassword)
      settingsPage.confirmPasswordInput().type(complexPassword)
      settingsPage.changePasswordButton().click()

      // ensure change password elements are not displayed after change
      settingsPage.passwordInput().should("not.exist")
      settingsPage.confirmPasswordInput().should("not.exist")
      settingsPage.changePasswordButton().should("not.exist")
    })

    it("can see error messages when password doesn't meet critieria", () => {
      cy.web3Login()
      navigationMenu.settingsNavButton().click()
      settingsPage.securityTabButton().click()
      settingsPage.securityTabButton().click()
      settingsPage.changePasswordLink().click()

      // ensure errors are displayed if password fields are blank
      settingsPage.passwordInput().type("{selectall}{del}{esc}")
      settingsPage.confirmPasswordInput().type("{selectall}{del}{esc}")
      settingsPage.changePasswordButton().click()
      settingsPage.changePasswordErrorLabel()
        .should("be.visible")
        .should("have.length", 2)

      // ensure an error displayed if password is not complex enough
      settingsPage.passwordInput().type(simplePassword)
      settingsPage.changePasswordButton().click()
      settingsPage.changePasswordErrorLabel()
        .should("be.visible")
        .should("have.length", 2)

      // should see an error if confirm password is missing
      settingsPage.passwordInput().type(complexPassword)
      settingsPage.confirmPasswordInput().type("{selectall}{del}{esc}")
      settingsPage.changePasswordButton().click()
      settingsPage.changePasswordErrorLabel()
        .should("be.visible")
        .should("have.length", 1)

      // should see an error if confirm password does not match password
      settingsPage.passwordInput().type(complexPassword)
      settingsPage.confirmPasswordInput().type(simplePassword)
      settingsPage.changePasswordButton().click()
      settingsPage.changePasswordErrorLabel()
        .should("be.visible")
        .should("have.length", 1)
    })

    it("can change to dark theme and light theme", () => {
      cy.web3Login()
      navigationMenu.settingsNavButton().click()
      settingsPage.displayTabButton().click()

      // change to dark theme and ensure change of color
      settingsPage.darkThemeLabel().click().then(() => {
        expect(window.localStorage.getItem("csf.themeKey")).to.equal("dark")
      })
      settingsPage.darkThemeLabel().get("div").should("have.class", "checked")
      settingsPage.displayTabHeader().should("have.css", "color", "rgb(219, 219, 219)")

      // change to light theme and ensure change of color
      settingsPage.lightThemeLabel().click().then(() => {
        expect(window.localStorage.getItem("csf.themeKey")).to.equal("light")
      })
      settingsPage.lightThemeLabel().get("div").should("have.class", "checked")
      settingsPage.displayTabHeader().should("have.css", "color", "rgb(15, 15, 15)")
    })

    it("can copy to clipboard wallet address and files sharing key", () => {
      cy.web3Login()
      navigationMenu.settingsNavButton().click()
      settingsPage.profileTabButton().click()
      cy.url().should("include", "/settings/profile")

      // ensure the correct wallet address is being copied to the clipboard
      settingsPage.walletAddressLabel().click()
      cy.window().its("navigator.clipboard").invoke("readText").then((text) => {
        settingsPage.walletAddressLabel().should((element) => {
          const walletAddress = element.text().split("...")
          expect(text.startsWith(walletAddress[0])).to.be.true
          expect(text.endsWith(walletAddress[1])).to.be.true
        })
      })

      // ensure the correct files sharing key is being copied to the clipboard
      settingsPage.filesSharingKetLabel().click()
      cy.window().its("navigator.clipboard").invoke("readText").then((text) => {
        settingsPage.filesSharingKetLabel().should((element) => {
          const filesSharingKey = element.text().split("...")
          expect(text.startsWith(filesSharingKey[0])).to.be.true
          expect(text.endsWith(filesSharingKey[1])).to.be.true
        })
      })
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
