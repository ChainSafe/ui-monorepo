describe("My First Test", () => {
  it("Visits the login page", () => {
    // cy.fixture("login").then((fixt) => {
    //   Object.keys(fixt).forEach((key) => {
        // cy.window().then((window) => {
        //   window.sessionStorage.setItem(key, fixt[key])
        // })
    //   })
    // })

    cy.web3Login()
  })
})
