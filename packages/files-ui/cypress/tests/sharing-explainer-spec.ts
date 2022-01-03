import { navigationMenu } from "../support/page-objects/navigationMenu"
import { sharingExplainerModal } from "../support/page-objects/modals/sharingExplainerModal"
import { sharingExplainerKey } from "../fixtures/filesTestData"

describe("Sharing Explainer", () => {

  context("desktop", () => {

    it("User can view and dismiss the sharing explainer", () => {
      // intercept and stub the response to ensure the explainer is displayed
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "false" }
      })

      cy.web3Login()
      navigationMenu.sharedNavButton().click()
      sharingExplainerModal.body().should("be.visible")

      // set up a spy for the POST response
      cy.intercept("POST", "**/user/store").as("storePost").then(() => {

        // dismiss the sharing explainer
        sharingExplainerModal.nextButton().click()
        sharingExplainerModal.nextButton().click()
        sharingExplainerModal.nextButton().click()
        sharingExplainerModal.gotItButton().click()
        sharingExplainerModal.body().should("not.exist")

        // intercept POST to ensure the key was updated after the explainer is dismissed
        cy.wait("@storePost").its("request.body").should("contain", {
          [sharingExplainerKey]: "true"
        })
      })
    })

    it("User can dismiss the sharing explainer with the cross", () => {
      // intercept and stub the response to ensure the explainer is displayed
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "false" }
      })

      cy.web3Login()
      navigationMenu.sharedNavButton().click()
      sharingExplainerModal.body().should("be.visible")

      // set up a spy for the POST response
      cy.intercept("POST", "**/user/store").as("storePost").then(() => {

        // dismiss the sharing explainer
        sharingExplainerModal.closeButton().safeClick()
        sharingExplainerModal.body().should("not.exist")

        // intercept POST to ensure the key was updated after the explainer is dismissed
        cy.wait("@storePost").its("request.body").should("contain", {
          [sharingExplainerKey]: "true"
        })
      })
    })

    it("User should not see sharing explainer if previously dismissed", () => {
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login()

      navigationMenu.sharedNavButton().click()
      sharingExplainerModal.body().should("not.exist")
    })

    it("User should see the sharing explainer if api response is empty", () => {
      cy.intercept("GET", "**/user/store", {
        body: {}
      })

      cy.web3Login()
      navigationMenu.sharedNavButton().click()
      sharingExplainerModal.body().should("be.visible")
    })
  })
})