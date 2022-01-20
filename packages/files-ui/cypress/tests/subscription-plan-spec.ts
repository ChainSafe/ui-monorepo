import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { addOrUpdateCardModal } from "../support/page-objects/modals/addCardModal"
import { visaNumber, visaExpiry, visaCvc } from "../fixtures/cardData"
import { mastercardNumber, mastercardExpiry, mastercardCvc } from "../fixtures/cardData"
import { cardAddedToast } from "../support/page-objects/toasts/cardAddedToast"
import { cardUpdatedToast } from "../support/page-objects/toasts/cardUpdatedToast"
import { removeCardModal } from "../support/page-objects/modals/removeCardModal"

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
  })
})