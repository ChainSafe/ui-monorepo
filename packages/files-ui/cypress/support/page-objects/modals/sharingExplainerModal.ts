export const sharingExplainerModal = {
  body: () => cy.get("[data-testId=modal-container-sharing-explainer]"),
  gotItButton: () => cy.get("[data-cy=button-got-it]"),
  nextButton: () => cy.get("[data-cy=button-next]"),
  closeButton: () => cy.get("[data-testId=button-close-modal-sharing-explainer]")
}
