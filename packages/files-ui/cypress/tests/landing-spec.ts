import { authenticationPage } from "../support/page-objects/authenticationPage"
import { localHost } from "../fixtures/loginData"

describe("Landing", () => {
  beforeEach(() => {
    cy.visit(localHost)
  })
  context("desktop", () => {

    it("can navigate to privacy policy page", () => {
      authenticationPage.privacyPolicyLink().invoke('removeAttr', 'target').click()
      cy.url().should("include", "/privacy-policy")
    })

    it("can navigate to terms & conditions page", () => {
      authenticationPage.termsAndConditionsLink().invoke('removeAttr', 'target').click()
      cy.url().should("include", "/terms-of-service")
    })

    it("can navigate to ChainSafe.io from 'Learn more about Chainsafe'", () => {
      authenticationPage.learnMoreAboutChainsafeLink().invoke('removeAttr', 'target').click()
      cy.url().should("eq", "https://chainsafe.io/")
    })
  })
})
