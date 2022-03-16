import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { homePage } from "../support/page-objects/homePage"

describe("Notifications", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/billing/eligibilities", {
      body: { is_eligible: true }
    })
  })
  context("desktop", () => {

    it("can see a notification if card is expiring soon", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })

      // upgrade subscription with a card expiring this month
      navigationMenu.settingsNavButton().click()
      settingsPage.upgradeSubscription("max", "expiring")

      // access and inspect notification menu
      settingsPage.notificationButton().click()
      settingsPage.notificationsHeader().should("be.visible")
      settingsPage.notificationsThisWeekHeader().should("be.visible")
      settingsPage.notificationsOlderHeader().should("not.exist")
      settingsPage.notificationContainer().should("have.length", 1)

      // ensure individual notification has title and date
      settingsPage.notificationContainer().within(() => {
        settingsPage.notificationTitle().should("be.visible")
        settingsPage.notificationTime().should("be.visible")
      })

      // click notification button to dismiss
      settingsPage.notificationButton().click()
      settingsPage.notificationContainer().should("not.be.visible")

      // navigate away and return to plan page from notification
      navigationMenu.homeNavButton().click()
      cy.url().should("include", "/drive")
      homePage.notificationButton().click()
      homePage.notificationContainer().click()
      cy.url().should("include", "/settings/plan")
    })
  })
})