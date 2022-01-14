import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { addOrUpdateCardModal } from "../support/page-objects/modals/addCardModal"
import { visaNumber, visaExpiry, visaCvc } from "../fixtures/cardData"
import { mastercardNumber, mastercardExpiry, mastercardCvc } from "../fixtures/cardData"
import { cardAddedToast } from "../support/page-objects/toasts/cardAddedToast"
import { cardUpdatedToast } from "../support/page-objects/toasts/cardUpdatedToast"
import { removeCardModal } from "../support/page-objects/modals/removeCardModal"
import { selectPlanModal } from "../support/page-objects/modals/selectPlanModal"

describe("Subscription Plan", () => {

  context("desktop", () => {

    it.skip("can add, update and remove a credit card for billing", () => {
      cy.web3Login()

      // navigate to settings
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()

      // add a card
      settingsPage.addCardButton()
        .should("be.visible")
        .click()
      addOrUpdateCardModal.body().should("be.visible")
      addOrUpdateCardModal.addCardHeader().should("be.visible")
      // wait is needed to allow time for the stripe components to be editable
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000)
      addOrUpdateCardModal.cardNumberInput().type(visaNumber)
      addOrUpdateCardModal.expiryDateInput().type(visaExpiry)
      addOrUpdateCardModal.cvcNumberInput().type(visaCvc)
      addOrUpdateCardModal.addCardButton().safeClick()
      cardAddedToast.body().should("be.visible")
      cardAddedToast.closeButton().click()
      settingsPage.updateCardButton().should("be.visible")
      settingsPage.defaultCardLabel().should("be.visible")

      // store displayed visa details as cypress alias
      settingsPage.defaultCardLabel().invoke("text").as("partialMaskedVisa")

      // update the card
      settingsPage.updateCardButton().click()
      addOrUpdateCardModal.body().should("be.visible")
      addOrUpdateCardModal.updateCardHeader().should("be.visible")
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000)
      addOrUpdateCardModal.cardNumberInput().type(mastercardNumber)
      addOrUpdateCardModal.expiryDateInput().type(mastercardExpiry)
      addOrUpdateCardModal.cvcNumberInput().type(mastercardCvc)
      addOrUpdateCardModal.updateCardButton().safeClick()
      cardUpdatedToast.body().should("be.visible")
      cardUpdatedToast.closeButton().click()
      settingsPage.defaultCardLabel().should("be.visible")

      // wait is needed to allow time for the ui to update
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000)
      // store displayed mastercard details as cypress alias
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

    it("can select different subscription plans and view plan summaries", () => {
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
          // button should be disabled when already on free plan
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
    })
  })
})