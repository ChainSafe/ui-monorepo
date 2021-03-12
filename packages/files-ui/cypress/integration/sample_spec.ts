describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    cy.visit("https://example.cypress.io")
    cy.pause()
    cy.contains("type").click()
    cy.url().should("include", "/commands/actions")

    cy.get("#email1").type("blabla").should("have.value", "blabla")
  })
})