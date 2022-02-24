export const sharingExplainerModal = {
  body: () => cy.get("[data-testid=modal-container-sharing-explainer]"),
  gotItButton: () => cy.get("[data-cy=button-got-it]"),
  nextButton: () => cy.get("[data-cy=button-next]"),
  closeButton: () => cy.get("[data-testid=button-close-modal-sharing-explainer]")
}
