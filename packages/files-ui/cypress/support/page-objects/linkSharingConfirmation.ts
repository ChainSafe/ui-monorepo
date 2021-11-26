export const linkSharingConfirmation = {
  browseButton: () => cy.get("[data-cy=button-browse-share-folder]", { timeout: 10000 }),
  labelLinkError: () => cy.get("[data-cy=label-link-error]", { timeout: 10000 }),
  labelLinkAddConfirmation: () => cy.get("[data-cy=label-added-to-share-confirmation", { timeout: 10000 }),
  labelLinkVerification: () => cy.get("[data-cy=label-link-verfication")
}

