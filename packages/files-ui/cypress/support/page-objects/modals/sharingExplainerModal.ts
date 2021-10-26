export const sharingExplainerModal = {
  body: () => cy.get("[data-testId=modal-container-sharing-explainer]"),
  gotItButton: () => cy.get("[data-testId=button-got-it]"),
  nextButton: () => cy.get("[data-testId=button-next]")
}
