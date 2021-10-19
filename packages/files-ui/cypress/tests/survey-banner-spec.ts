import { homePage } from "../support/page-objects/homePage"

describe("Survey Banner", () => {

  context("desktop", () => {

    it("User can view and dismiss the survey banner", () => {

      // intercept store GET and stub value to ensure banner display
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{ "csf.dismissedSurveyBannerV3": "false" }]
      })

      cy.web3Login()
      homePage.surveyBanner().should("be.visible")

      // set up spy for POST response
      cy.intercept("POST", "https://stage.imploy.site/api/v1/user/store").as("storePost").then(() => {

        // dismiss the survey banner
        homePage.closeBannerButton().click()
        homePage.surveyBanner().should("not.exist")

        // intercept POST and ensure the key was updated when banner is dismissed
        cy.wait("@storePost").its("request.body").should("contain", {
          "csf.dismissedSurveyBannerV3": "true"
        })
      })
    })

    it("User who has previously dismissed the survey banner should not see it", () => {
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{ "csf.dismissedSurveyBannerV3": "true" }]
      })

      cy.web3Login()
      homePage.surveyBanner().should("not.exist")
    })

    it("User should see survey when api response is empty and account is greater than 7 days", () => {
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{}]
      })

      cy.web3Login()
      homePage.surveyBanner().should("be.visible")
    })

    it("User should not see survey when api response is empty and account is less than 7 days", () => {
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{}]
      })

      cy.web3Login()
      homePage.surveyBanner().should("not.be.visible")
    })
  })
})