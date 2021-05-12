describe("Settings", () => {
  it("can navigate to the settings profile page", () => {
    cy.web3Login()
    cy.get("[data-cy=settings-nav]").click()
    cy.get("[data-cy=settings-profile-header").should("be.visible")
    cy.url().should("include", "/settings")
  })

  it("can navigate to the settings security page on a phone", () => {
    cy.viewport("iphone-6")
    cy.web3Login()
    cy.get(".hamburger-menu").click()
    cy.get("[data-cy=settings-nav]").click()
    cy.get("[data-cy=settings-profile-header]").should("not.exist")
    cy.url().should("include", "/settings")
  })
})
