describe("Settings", () => {
  it("can navigate to the settings profile page", () => {
    cy.web3Login()
    cy.get("[data-cy=settings-nav]").click()
    cy.get("[data-cy=settings-profile-header]").should("be.visible")
    cy.url().should("include", "/settings")
    cy.get("[data-testid=profile-tab]").click()
    cy.url().should("include", "/settings/profile")
    cy.get("[data-cy=settings-profile-header]").should("be.visible")
    cy.get("[data-testid=security-tab]").click()
    cy.url().should("include", "/settings/security")
    cy.get("[data-cy=settings-security-header]").should("be.visible")
  })

  context("mobile", () => {
    before(() => {
      cy.viewport("iphone-6")
    })

    it("can navigate to the settings security page on a phone", () => {
      cy.web3Login()
      cy.get("[data-testId=hamburger-menu]").click()
      cy.get("[data-cy=settings-nav]").click()
      cy.get("[data-cy=settings-profile-header]").should("not.exist")
      cy.url().should("include", "/settings")
      cy.get("[data-testid=profile-tab]").click()
      cy.url().should("include", "/settings/profile")
      cy.get("[data-cy=settings-profile-header]").should("be.visible")
      cy.go("back")
      cy.get("[data-testid=security-tab]").click()
      cy.url().should("include", "/settings/security")
      cy.get("[data-cy=settings-security-header]").should("be.visible")
    })
  })
})
