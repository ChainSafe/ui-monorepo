import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { addOrUpdateCardModal } from "../support/page-objects/modals/addOrUpdateCardModal"
import { invalidCardNumber, invalidExpiry, invalidCvc } from "../fixtures/cardData"
import { visaNumber, visaExpiry, visaCvc } from "../fixtures/cardData"
import { mastercardNumber, mastercardExpiry, mastercardCvc } from "../fixtures/cardData"
import { cardAddedToast } from "../support/page-objects/toasts/cardAddedToast"
import { cardUpdatedToast } from "../support/page-objects/toasts/cardUpdatedToast"
import { removeCardModal } from "../support/page-objects/modals/removeCardModal"
import { selectPlanModal } from "../support/page-objects/modals/selectPlanModal"
import { planDetailsModal } from "../support/page-objects/modals/planDetailsModal"

describe("Subscription Plan", () => {

  context("desktop", () => {

    it("can add, update and remove a credit card for billing", () => {
      cy.web3Login({ deleteCreditCard: true })

      // navigate to settings
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()

      // add a card
      settingsPage.addCardButton()
        .should("be.visible")
        .click()
      addOrUpdateCardModal.body().should("be.visible")
      addOrUpdateCardModal.addCardHeader().should("be.visible")
      addOrUpdateCardModal.awaitStripeElementReady()
      addOrUpdateCardModal.cardNumberInput().type(visaNumber)
      addOrUpdateCardModal.expiryDateInput().type(visaExpiry)
      addOrUpdateCardModal.cvcNumberInput().type(visaCvc)
      addOrUpdateCardModal.addCardButton().click()

      // for reliability wait for stripe and default card responses / requests
      settingsPage.awaitStripeConfirmation()
      settingsPage.awaitDefaultCardRequest()

      // close toast and ensure a card is now shown on profile
      cardAddedToast.body().should("be.visible")
      cardAddedToast.closeButton().click()
      settingsPage.updateCardButton().should("be.visible")
      settingsPage.defaultCardLabel().should("be.visible")

      // store the displayed visa details as cypress alias
      settingsPage.defaultCardLabel().invoke("text").as("partialMaskedVisa")

      // update the card
      settingsPage.updateCardButton().click()
      addOrUpdateCardModal.body().should("be.visible")
      addOrUpdateCardModal.updateCardHeader().should("be.visible")
      addOrUpdateCardModal.awaitStripeElementReady()
      addOrUpdateCardModal.cardNumberInput().type(mastercardNumber)
      addOrUpdateCardModal.expiryDateInput().type(mastercardExpiry)
      addOrUpdateCardModal.cvcNumberInput().type(mastercardCvc)
      addOrUpdateCardModal.updateCardButton().click()

      // for reliability wait for stripe and default card responses / requests
      settingsPage.awaitStripeConfirmation()
      settingsPage.awaitDefaultCardRequest()

      // close toast and ensure a card is shown on profile
      cardUpdatedToast.body().should("be.visible")
      cardUpdatedToast.closeButton().click()
      settingsPage.defaultCardLabel().should("be.visible")

      // store the displayed mastercard details as cypress alias
      settingsPage.defaultCardLabel().invoke("text").as("partialMaskedMastercard")

      // ensure the card number was updated by comparing cypress aliases
      cy.get("@partialMaskedVisa").then(($partialMaskedVisa) => {
        cy.get("@partialMaskedMastercard").should("not.equal", $partialMaskedVisa)
      })

      // remove the card
      settingsPage.removeCardLink().click()
      removeCardModal.body().should("be.visible")
      removeCardModal.confirmButton().safeClick()
      settingsPage.noCardLabel().should("be.visible")
      settingsPage.addCardButton().should("be.visible")
    })

    it("can not add an invalid card to the profile", () => {
      cy.web3Login({ deleteCreditCard: true })

      // navigate to settings
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()

      // attempt to add card with invalid number
      settingsPage.addCardButton()
        .should("be.visible")
        .click()
      addOrUpdateCardModal.body().should("be.visible")
      addOrUpdateCardModal.addCardHeader().should("be.visible")
      addOrUpdateCardModal.awaitStripeElementReady()
      addOrUpdateCardModal.cardNumberInput().type(invalidCardNumber)
      addOrUpdateCardModal.expiryDateInput().type(visaExpiry)
      addOrUpdateCardModal.cvcNumberInput().type(visaCvc)
      addOrUpdateCardModal.addCardButton().click()

      // ensure error is displayed and modal remains in view
      addOrUpdateCardModal.cardErrorLabel().should("be.visible")
      addOrUpdateCardModal.body().should("be.visible")

      // attempt to add card with invalid expiry
      addOrUpdateCardModal.cardNumberInput()
        .type("{selectall}{del}")
        .type(visaNumber)
      addOrUpdateCardModal.expiryDateInput()
        .type("{selectall}{del}")
        .type(invalidExpiry)
      addOrUpdateCardModal.cvcNumberInput()
        .type("{selectall}{del}")
        .type(visaCvc)
      addOrUpdateCardModal.addCardButton().click()

      // ensure error is displayed and modal remains in view
      addOrUpdateCardModal.cardErrorLabel().should("be.visible")
      addOrUpdateCardModal.body().should("be.visible")

      // attempt to add card with invalid cvc
      addOrUpdateCardModal.cardNumberInput()
        .type("{selectall}{del}")
        .type(visaNumber)
      addOrUpdateCardModal.expiryDateInput()
        .type("{selectall}{del}")
        .type(visaExpiry)
      addOrUpdateCardModal.cvcNumberInput()
        .type("{selectall}{del}")
        .type(invalidCvc)
      addOrUpdateCardModal.addCardButton().click()

      // ensure error is displayed and modal remains in view
      addOrUpdateCardModal.cardErrorLabel().should("be.visible")
      addOrUpdateCardModal.body().should("be.visible")
    })

    it("can select a subscription plan and view plan details", () => {
      cy.web3Login()

      // navigate to settings
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()
      settingsPage.changePlanButton().click()

      selectPlanModal.body().should("be.visible")
      selectPlanModal.planBoxContainer().should("have.length.greaterThan", 0)

      // create cypress aliases for the plans
      selectPlanModal.planBoxContainer().contains("Free plan")
        .should("be.visible")
        .as("freePlanBox")
      selectPlanModal.planBoxContainer().contains("Standard plan")
        .should("be.visible")
        .as("standardPlanBox")
      selectPlanModal.planBoxContainer().contains("Premium plan")
        .should("be.visible")
        .as("premiumPlanBox")

      // ensure all plan boxes contain expected elements and element state
      cy.get("@freePlanBox").parent().within(() => {
        selectPlanModal.planTitleLabel().should("be.visible")
        selectPlanModal.FreePriceLabel().should("be.visible")
        selectPlanModal.storageDescriptionLabel().should("be.visible")
        selectPlanModal.selectPlanButton()
          .should("be.visible")
          // ensure button is disabled when on default free plan
          .should("be.disabled")
      })

      cy.get("@standardPlanBox").parent().within(() => {
        selectPlanModal.planTitleLabel().should("be.visible")
        selectPlanModal.monthlyPriceLabel().should("be.visible")
        selectPlanModal.storageDescriptionLabel().should("be.visible")
        selectPlanModal.selectPlanButton()
          .should("be.visible")
          .should("be.enabled")
      })

      cy.get("@premiumPlanBox").parent().within(() => {
        selectPlanModal.planTitleLabel().should("be.visible")
        selectPlanModal.monthlyPriceLabel().should("be.visible")
        selectPlanModal.storageDescriptionLabel().should("be.visible")
        selectPlanModal.selectPlanButton()
          .should("be.visible")
          .should("be.enabled")
      })

      // select the standard plan 
      cy.get("@standardPlanBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })

      // ensure all the default plan details are displayed
      planDetailsModal.body().should("be.visible")
      planDetailsModal.selectedPlanHeader().should("be.visible")
      planDetailsModal.selectedPlanSubheader().should("be.visible")
      planDetailsModal.featuresLabel().should("be.visible")
      planDetailsModal.storageDetailsLabel().should("be.visible")
      planDetailsModal.billingLabel().should("be.visible")
      planDetailsModal.billingStartDate().should("be.visible")
      planDetailsModal.monthlyBillingLabel().should("be.visible")
      planDetailsModal.yearlyBillingLabel().should("not.exist")
      planDetailsModal.durationToggleSwitch().should("be.visible")
      planDetailsModal.totalCostLabel().should("be.visible")
      planDetailsModal.selectThisPlanButton().should("be.visible")
      planDetailsModal.goBackButton().should("be.visible")

      // retrieve monthly plan data as cypress alias for later comparison
      planDetailsModal.totalCostLabel().invoke("text").as("monthlyBillingPrice")

      // toggle to display yearly pay
      planDetailsModal.durationToggleSwitch().click()
      planDetailsModal.monthlyBillingLabel().should("not.exist")
      planDetailsModal.yearlyBillingLabel().should("be.visible")
      planDetailsModal.totalCostLabel().invoke("text").as("yearlyBillingPrice")

      // price should update when switching to yearly
      cy.get("@monthlyBillingPrice").then(($monthlyBillingPrice) => {
        cy.get("@yearlyBillingPrice").should("not.equal", $monthlyBillingPrice)
      })

      // return to plan selection
      planDetailsModal.goBackButton().click()
      selectPlanModal.body().should("be.visible")
    })
  })
})