import { profileCreatedDate } from "../fixtures/filesTestData"
import { homePage } from "../support/page-objects/homePage"

describe("Survey Banner", () => {

  context("desktop", () => {

    it("User can view and dismiss the survey banner", () => {
      // intercept and stub the account creation date to be > 7 days
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/profile", (req) => {
        req.on("response", (res) => {
          res.body.created_at = profileCreatedDate 
        })
      })

      // intercept and stub the response to ensure the banner is displayed
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{ "csf.dismissedSurveyBannerV3": "false" }]
      })

      cy.web3Login()
      homePage.surveyBanner().should("be.visible")

      // set up a spy for the POST response
      cy.intercept("POST", "https://stage.imploy.site/api/v1/user/store").as("storePost").then(() => {

        // dismiss the survey banner
        homePage.closeBannerButton().click()
        homePage.surveyBanner().should("not.exist")

        // intercept POST to ensure the key was updated after the banner is dismissed
        cy.wait("@storePost").its("request.body").should("contain", {
          "csf.dismissedSurveyBannerV3": "true"
        })
      })
    })

    it("User should not see the survey banner if previously dismissed", () => {
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{ "csf.dismissedSurveyBannerV3": "true" }]
      })

      cy.web3Login()
      homePage.surveyBanner().should("not.exist")
    })

    it("User should see banner if account age is greater than 7 days and api response is empty", () => {
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{}]
      })

      cy.web3Login()
      homePage.surveyBanner().should("be.visible")
    })

    it("User should not see banner if account age is less than 7 days and api response is empty", () => {
      // intercept and stub the account creation date to make it less than 7 days
      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/profile", (req) => {
        req.on("response", (res) => {
          res.body.created_at = res.body.updated_at
        })
      })

      cy.intercept("GET", "https://stage.imploy.site/api/v1/user/store", {
        body: [{}]
      })

      cy.web3Login()
      homePage.surveyBanner().should("not.exist")
    })
  })
})
