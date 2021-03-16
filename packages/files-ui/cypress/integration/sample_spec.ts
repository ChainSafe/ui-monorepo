import {TORUS_POSTBOX_KEY} from '../../src/Contexts/ThresholdKeyContext';


describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    cy.visit("http://localhost:3000")
    cy.pause()
    cy.fixture('login').then((fixt) => {
      console.log('fix', fixt)

      cy.window().then((window) => {
        window.sessionStorage.setItem(TORUS_POSTBOX_KEY, 'bla')
      })
    })
  })
})