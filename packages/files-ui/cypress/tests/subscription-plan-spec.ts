import { navigationMenu } from "../support/page-objects/navigationMenu"
import { settingsPage } from "../support/page-objects/settingsPage"
import { addOrUpdateCardModal } from "../support/page-objects/modals/addOrUpdateCardModal"
import { invalidCardNumber, invalidExpiry, invalidCvc } from "../fixtures/cardData"
import { visaNumber, visaExpiry, visaCvc } from "../fixtures/cardData"
import { mastercardNumber, mastercardExpiry, mastercardCvc } from "../fixtures/cardData"
import { cardAddedToast } from "../support/page-objects/toasts/cardAddedToast"
import { cardUpdatedToast } from "../support/page-objects/toasts/cardUpdatedToast"
import { removeCardModal } from "../support/page-objects/modals/removeCardModal"
import { selectPlanModal } from "../support/page-objects/modals/billing/selectPlanModal"
import { planDetailsModal } from "../support/page-objects/modals/billing/planDetailsModal"
import { selectPaymentMethodModal } from "../support/page-objects/modals/billing/selectPaymentMethodModal"
import { planChangeConfirmationModal } from "../support/page-objects/modals/billing/planChangeConfirmationModal"
import { planChangeSuccessModal } from "../support/page-objects/modals/billing/planChangeSuccessModal"
import { billingHistoryPage } from "../support/page-objects/billingHistoryPage"
import { downgradeDetailsModal } from "../support/page-objects/modals/billing/downgradeDetailsModal"
import { cryptoPaymentModal } from "../support/page-objects/modals/billing/cryptoPaymentModal"

describe("Subscription Plan", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/billing/eligibilities", {
      body: { is_eligible: true }
    })
  })
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
      cy.awaitStripeElementReady()
      addOrUpdateCardModal.cardNumberInput().type(visaNumber)
      addOrUpdateCardModal.expiryDateInput().type(visaExpiry)
      addOrUpdateCardModal.cvcNumberInput().type(visaCvc)
      addOrUpdateCardModal.addCardButton().click()

      // for reliability wait for stripe and default card responses / requests
      cy.awaitStripeConfirmation()
      cy.awaitDefaultCardRequest()

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
      cy.awaitStripeElementReady()
      addOrUpdateCardModal.cardNumberInput().type(mastercardNumber)
      addOrUpdateCardModal.expiryDateInput().type(mastercardExpiry)
      addOrUpdateCardModal.cvcNumberInput().type(mastercardCvc)
      addOrUpdateCardModal.updateCardButton().click()

      // for reliability wait for stripe and default card responses / requests
      cy.awaitStripeConfirmation()
      cy.awaitDefaultCardRequest()

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
      cy.awaitStripeElementReady()
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
      cy.web3Login({ resetToFreePlan: true })

      // navigate to settings
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()
      settingsPage.changePlanButton().click()

      selectPlanModal.body().should("be.visible")
      selectPlanModal.planBoxContainer().should("have.length.greaterThan", 0)

      // create cypress aliases for the plans
      selectPlanModal.createPlanCypressAliases()

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
      planDetailsModal.annualBillingLabel().should("be.visible")
      planDetailsModal.durationToggleSwitch().should("be.visible")
      planDetailsModal.totalCostLabel().should("be.visible")
      planDetailsModal.selectThisPlanButton().should("be.visible")
      planDetailsModal.goBackButton().should("be.visible")

      // return to plan selection
      planDetailsModal.goBackButton().click()
      selectPlanModal.body().should("be.visible")
    })

    it("cannot downgrade if used storage exceeds plan allowance", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })

      // upgrade to a premium plan first
      navigationMenu.settingsNavButton().click()
      settingsPage.upgradeSubscription("premium")

      // setup intercepter, stub the used products response to disallow update
      cy.intercept("GET", "**/billing/products", (req) => {
        req.on("response", (res) => {
          res.body = [{ "prices": [{ "is_update_allowed": false }] }]
        })
      })

      settingsPage.changePlanButton().click()
      selectPlanModal.body().should("be.visible")
      selectPlanModal.planBoxContainer().should("have.length.greaterThan", 0)

      // ensure warning is shown and the free plan is not selectable
      cy.get("@freePlanBox").parent().within(() => {
        selectPlanModal.storageCapacityWarningLabel().should("be.visible")
        selectPlanModal.selectPlanButton()
          .should("be.visible")
          .should("be.disabled")
      })
    })

    it("can toggle between monthly and annual billing price", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()
      settingsPage.changePlanButton().click()

      // create cypress aliases for the plans
      selectPlanModal.createPlanCypressAliases()

      cy.get("@standardPlanBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })

      // retrieve the monthly plan data as cypress alias for later comparison
      planDetailsModal.totalCostLabel().invoke("text").as("monthlyBillingPrice")

      // toggle to enable annual billing
      planDetailsModal.durationToggleSwitch().click()
      planDetailsModal.totalCostLabel().invoke("text").as("yearlyBillingPrice")

      // price should update when switching to annual billing
      cy.get("@monthlyBillingPrice").then(($monthlyBillingPrice) => {
        cy.get("@yearlyBillingPrice").should("not.equal", $monthlyBillingPrice)
      })
    })

    it("can only choose crypto as a payment option for annual billing", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()
      settingsPage.changePlanButton().click()

      selectPlanModal.planBoxContainer().contains("Standard plan")
        .should("be.visible")
        .as("standardPlanBox")

      cy.get("@standardPlanBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })

      // ensure the crypto option cannot be selected for monthly billing
      planDetailsModal.selectThisPlanButton().click()
      selectPaymentMethodModal.cryptoRadioInput()
        .should("be.visible")
        .click()
      selectPaymentMethodModal.selectPaymentButton().should("be.disabled")
      selectPaymentMethodModal.goBackButton().click()

      // toggle to enable annual billing
      planDetailsModal.durationToggleSwitch().click()
      planDetailsModal.totalCostLabel().invoke("text").as("yearlyBillingPrice")

      // ensure the crypto option can be selected for annual billing
      planDetailsModal.selectThisPlanButton().click()
      selectPaymentMethodModal.cryptoRadioInput()
        .should("be.visible")
        .click()
      selectPaymentMethodModal.selectPaymentButton().should("be.enabled")
    })

    it("can upgrade the plan via credit card payment", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })

      // navigate to settings
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()

      // initiate a plan change 
      settingsPage.changePlanButton().click()
      selectPlanModal.body().should("be.visible")
      selectPlanModal.planBoxContainer().should("have.length.greaterThan", 0)

      // create a cypress alias for the premium plan
      selectPlanModal.planBoxContainer().contains("Premium plan")
        .should("be.visible")
        .as("premiumPlanBox")

      // select the premium plan 
      cy.get("@premiumPlanBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })

      planDetailsModal.selectThisPlanButton().click()

      // add a card
      selectPaymentMethodModal.body().should("be.visible")
      selectPaymentMethodModal.addCardTextButton()
        .should("be.visible")
        .click()
      cy.awaitStripeElementReady()
      selectPaymentMethodModal.cardNumberInput().type(visaNumber)
      selectPaymentMethodModal.expiryDateInput().type(visaExpiry)
      selectPaymentMethodModal.cvcNumberInput().type(visaCvc)
      selectPaymentMethodModal.useThisCardButton().click()

      // for reliability wait for stripe and default card responses / requests
      cy.awaitStripeConfirmation()
      cy.awaitDefaultCardRequest()
      cardAddedToast.body().should("be.visible")
      cardAddedToast.closeButton().click()

      selectPaymentMethodModal.selectPaymentButton().click()

      // ensure that details are shown on the confirm plan modal
      planChangeConfirmationModal.body().should("be.visible")
      planChangeConfirmationModal.confirmPlanHeader().should("be.visible")
      planChangeConfirmationModal.selectedPlanLabel().should("be.visible")
      planChangeConfirmationModal.editPlanLink().should("be.visible")
      planChangeConfirmationModal.featuresLabel().should("be.visible")
      planChangeConfirmationModal.featuresSummaryLabel().should("be.visible")
      planChangeConfirmationModal.selectedPaymentMethodLabel().should("be.visible")
      planChangeConfirmationModal.cardNumberLabel().should("be.visible")
      planChangeConfirmationModal.editPaymentMethodLink().should("be.visible")
      planChangeConfirmationModal.billingLabel().should("be.visible")
      planChangeConfirmationModal.billingStartDate().should("be.visible")
      planChangeConfirmationModal.totalLabel().should("be.visible")
      planChangeConfirmationModal.totalPriceLabel().should("be.visible")
      planChangeConfirmationModal.finalSaleWarningLabel().should("be.visible")
      planChangeConfirmationModal.goBackButton().should("be.visible")
      planChangeConfirmationModal.confirmPlanChangeButton().should("be.visible")

      // confirm the plan change
      planChangeConfirmationModal.confirmPlanChangeButton().click()

      // ensure details are shown on plan change success modal
      planChangeSuccessModal.body().should("be.visible")
      planChangeSuccessModal.confirmationHeader().should("be.visible")
      planChangeSuccessModal.planChangeSuccessSubheader().should("be.visible")
      planChangeSuccessModal.featuresSummaryLabel().should("be.visible")
      planChangeSuccessModal.newStorageCapacityLabel().should("be.visible")
      planChangeSuccessModal.newPlanNameLabel().should("be.visible")
      planChangeSuccessModal.billingHistoryLabel().should("be.visible")
      planChangeSuccessModal.invoicesLink().should("be.visible")
      planChangeSuccessModal.closeButton().should("be.visible")

      // go to billing history from the success modal
      planChangeSuccessModal.invoicesLink().click()
      cy.url().should("include", "/billing-history")

      // setup an api intercepter for download requests
      cy.intercept("GET", "**/billing/invoices/*/download").as("downloadRequest").then(() => {
        // ensure that the file download does not start until the download button is clicked
        cy.get("@downloadRequest").then(($request) => {
          // retrieving the alias (spy) should yield null because posts should not have been made yet
          expect($request).to.be.null
        })

        billingHistoryPage.viewPdfButton().first().click()

        // ensure the download request contains pdf content
        cy.wait("@downloadRequest").its("response.headers").should("contain", {
          "content-type": "application/pdf"
        })
      })
    })

    it("can downgrade from premium plan to standard plan", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })

      // upgrade to a premium plan first using convenience function
      navigationMenu.settingsNavButton().click()
      settingsPage.upgradeSubscription("premium")

      // store the upgraded plan name for later comparison
      settingsPage.planNameLabel()
        .should("be.visible")
        .invoke("text").as("premiumPlanName")

      // initiate the downgrade process
      settingsPage.changePlanButton().click()
      selectPlanModal.planBoxContainer().should("have.length.greaterThan", 0)
      cy.get("@standardPlanBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })

      // ensure the downgraded plan details are shown
      downgradeDetailsModal.body().should("be.visible")
      downgradeDetailsModal.downgradePlanHeader().should("be.visible")
      downgradeDetailsModal.lostFeaturesSummaryLabel().should("be.visible")
      downgradeDetailsModal.downgradedStorageLabel().should("be.visible")
      downgradeDetailsModal.downgradePaymentWarningLabel().should("be.visible")
      downgradeDetailsModal.goBackButton().should("be.visible")
      downgradeDetailsModal.switchToFreePlanButton().should("not.exist")

      // proceed with the switch to downgrade
      downgradeDetailsModal.switchPlanButton()
        .should("be.visible")
        .click()
      planDetailsModal.selectThisPlanButton().click()
      selectPaymentMethodModal.selectPaymentButton().click()
      planChangeConfirmationModal.confirmPlanChangeButton().click()
      planChangeSuccessModal.body().should("be.visible")
      planChangeSuccessModal.closeButton()
        .should("be.visible")
        .safeClick()

      // store the downgraded plan name for later comparison
      settingsPage.planNameLabel()
        .should("be.visible")
        .invoke("text").as("standardPlanName")

      // ensure the downgraded plan name is not the same as the previously upgraded plan
      cy.get("@premiumPlanName").then(($premiumPlanName) => {
        cy.get("@standardPlanName").should("not.equal", $premiumPlanName)
      })
    })

    it("can downgrade from standard plan to free plan", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })

      // upgrade to a standard plan first
      navigationMenu.settingsNavButton().click()
      settingsPage.upgradeSubscription("standard")

      // store the standard plan name for later comparison
      settingsPage.planNameLabel()
        .should("be.visible")
        .invoke("text").as("standardPlanName")

      // initiate the downgrade process
      settingsPage.changePlanButton().click()
      selectPlanModal.planBoxContainer().should("have.length.greaterThan", 0)
      cy.get("@freePlanBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })

      // ensure the downgraded plan details are shown
      downgradeDetailsModal.body().should("be.visible")
      downgradeDetailsModal.downgradePlanHeader().should("be.visible")
      downgradeDetailsModal.lostFeaturesSummaryLabel().should("be.visible")
      downgradeDetailsModal.downgradedStorageLabel().should("be.visible")
      downgradeDetailsModal.downgradePaymentWarningLabel().should("be.visible")
      downgradeDetailsModal.goBackButton().should("be.visible")
      downgradeDetailsModal.switchPlanButton().should("not.exist")

      // proceed with the switch to downgrade
      downgradeDetailsModal.switchToFreePlanButton()
        .should("be.visible")
        .click()

      // store the downgraded plan name for later comparison
      settingsPage.planNameLabel()
        .should("be.visible")
        .invoke("text").as("freePlanName")

      // ensure the downgraded plan name is not the same as the previously upgraded plan
      cy.get("@standardPlanName").then(($standardPlanName) => {
        cy.get("@freePlanName").should("not.equal", $standardPlanName)
      })
    })

    it("can initiate and return to a crypto payment flow within 60 minutes", () => {
      cy.web3Login({ deleteCreditCard: true, resetToFreePlan: true })
      navigationMenu.settingsNavButton().click()
      settingsPage.subscriptionTabButton().click()
      settingsPage.changePlanButton().click()
      selectPlanModal.createPlanCypressAliases()
      cy.get("@standardPlanBox").parent().within(() => {
        selectPlanModal.selectPlanButton().click()
      })

      // choose crypto as payment type
      planDetailsModal.durationToggleSwitch().click()
      planDetailsModal.selectThisPlanButton().click()
      selectPaymentMethodModal.cryptoRadioInput()
        .should("be.visible")
        .click()
      selectPaymentMethodModal.selectPaymentButton().click()

      // ensure crypto payment specific elements are displayed
      planChangeConfirmationModal.body().should("be.visible")
      planChangeConfirmationModal.payWithCryptoLabel().should("be.visible")
      planChangeConfirmationModal.acceptedCurrenciesLabel().should("be.visible")
      planChangeConfirmationModal.acceptedCryptoTypes().should("be.visible")
      planChangeConfirmationModal.finalSaleWarningLabel().should("be.visible")
      planChangeConfirmationModal.confirmPlanChangeButton().click()

      // ensure default crypto elements are displayed
      cryptoPaymentModal.body().should("be.visible")
      cryptoPaymentModal.payWithCryptoHeader().should("be.visible")
      cryptoPaymentModal.totalLabel().should("be.visible")
      cryptoPaymentModal.cryptoPaymentTimer().should("be.visible")
      cryptoPaymentModal.totalPriceLabel().should("be.visible")
      cryptoPaymentModal.selectCryptocurrencyLabel().should("be.visible")

      // choose a crypto currency
      cryptoPaymentModal.cryptoPaymentButton().contains("Ethereum").click()

      // ensure additional modal elements are displayed after crypto type is selected
      cryptoPaymentModal.receivingQrCodeContainer().should("be.visible")
      cryptoPaymentModal.currencyTypeWarning().should("be.visible")
      cryptoPaymentModal.destinationAddressLabelTitle().should("be.visible")
      cryptoPaymentModal.destinationAddressLabel().should("be.visible")
      cryptoPaymentModal.cryptoAmountTitleLabel().should("be.visible")
      cryptoPaymentModal.cryptoAmountLabel().should("be.visible")
      cryptoPaymentModal.crypoFinalSaleWarningLabel().should("be.visible")
      cryptoPaymentModal.goBackButton().should("be.visible")
      cryptoPaymentModal.connectWalletButton().should("be.visible")

      // close modal, ensure we can return to flow via "pay now" on settings page
      cryptoPaymentModal.closeButton().click()
      cryptoPaymentModal.body().should("not.exist")
      settingsPage.payNowButton().click()
      cryptoPaymentModal.body().should("be.visible")

      // close modal, ensure we can return to flow via "pay now" on billing history page
      cryptoPaymentModal.closeButton().click()
      cryptoPaymentModal.body().should("not.exist")
      settingsPage.allInvoicesLink().click()
      billingHistoryPage.payNowButton().click()
      cryptoPaymentModal.body().should("be.visible")
    })
  })
})