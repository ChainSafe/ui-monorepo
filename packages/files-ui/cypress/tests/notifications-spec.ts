import { homePage } from "../support/page-objects/homePage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { selectPlanModal } from "../support/page-objects/modals/billing/selectPlanModal"
import { planDetailsModal } from "../support/page-objects/modals/billing/planDetailsModal"
import { selectPaymentMethodModal } from "../support/page-objects/modals/billing/selectPaymentMethodModal"
import { planChangeConfirmationModal } from "../support/page-objects/modals/billing/planChangeConfirmationModal"
import { cryptoPaymentModal } from "../support/page-objects/modals/billing/cryptoPaymentModal"

describe("Notifications", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/billing/eligibilities", {
      body: { is_eligible: true }
    })
  })
  context("desktop", () => {

    it("can see and interact with a notification when a card is expiring soon", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true, withNewSession: true })

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

    it("can see and interact with a notification when crypto invoice is open", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true, withNewSession: true  })
      navigationMenu.settingsNavButton().click()

      // initiate crypto payment then exit upgrade flow
      settingsPage.subscriptionTabButton().click()
      settingsPage.changePlanButton().click()
      selectPlanModal.createPlanCypressAliases()
      cy.get("@filesProBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })
      planDetailsModal.durationToggleSwitch().click()
      planDetailsModal.selectThisPlanButton().click()
      selectPaymentMethodModal.cryptoRadioInput()
        .should("be.visible")
        .click()
      selectPaymentMethodModal.selectPaymentButton().click()
      planChangeConfirmationModal.confirmPlanChangeButton().click()
      cryptoPaymentModal.closeButton().click()

      // access and inspect notification menu
      settingsPage.notificationButton().click()
      settingsPage.notificationContainer().should("have.length", 1)

      // ensure individual notification has title and date
      settingsPage.notificationContainer().within(() => {
        settingsPage.notificationTitle().should("be.visible")
        settingsPage.notificationTime().should("be.visible")
      })

      // navigate away and return to the plan page from notification
      navigationMenu.homeNavButton().click()
      cy.url().should("include", "/drive")
      homePage.notificationButton().click()
      homePage.notificationContainer().click()
      cy.url().should("include", "/settings/plan")
    })
  })
})