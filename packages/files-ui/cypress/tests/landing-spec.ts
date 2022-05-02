import { authenticationPage } from "../support/page-objects/authenticationPage"
import { localHost } from "../fixtures/loginData"

describe("Landing", () => {
  beforeEach(() => {
    cy.visit(localHost)
  })
  context("desktop", () => {

    it("can navigate to privacy policy page", () => {
      authenticationPage.privacyPolicyButton().invoke('removeAttr', 'target').click()
      cy.url().should("include", "/privacy-policy")
    })

    it("can navigate to terms & conditions page", () => {
      authenticationPage.termsAndConditionsButton().invoke('removeAttr', 'target').click()
      cy.url().should("include", "/terms-of-service")
    })
  })
})
