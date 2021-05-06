import { localHost } from "../fixtures/loginData"

describe("Login with saving browser", () => {
  it("allows reload without login in again", () => {
    const local: Array<Record<string, string>> = [] 

    cy.web3Login({saveBrowser: true})

    cy.window().then((win) => {
      Object.keys(win.localStorage).forEach((key) => {
        local.push({key, value: localStorage.getItem(key) || ""})
      });
    })
    cy.visit(localHost)
    cy.window().then((win) => {
      local.forEach(({key, value}) => {
        win.localStorage.setItem(key, value)
      });
    })
    cy.get("[data-cy=web3]").click()
    cy.get("[data-cy=sign-in-with-web3-button]").click()
    cy.get("[data-cy=files-app-header", { timeout: 15000 }).should("be.visible")
  })
})
