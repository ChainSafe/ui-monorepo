export const previewModal = {
  body: () => cy.get("[data-cy=modal-container-preview]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-cy=button-close-preview]"),
  fileNameLabel: () => cy.get("[data-cy=label-previewed-file-name]"),
  previewKebabButton: () => cy.get("[data-testid=menu-title-preview-kebab]"),
  downloadFileButton: () => cy.get("[data-cy=button-download-previewed-file]"),
  previousFileButton: () => cy.get("[data-cy=button-view-previous-file]"),
  nextFileButton: () => cy.get("[data-cy=button-view-next-file]"),
  downloadUnsupportedFileButton: () => cy.get("[data-cy=button-download-unsupported-file]"),
  zoomOutButton: () => cy.get("[data-cy=button-zoom-out]"),
  ZoomInButton: () => cy.get("[data-cy=button-zoom-in]"),
  fullScreenButton: () => cy.get("[data-cy=button-full-screen]")
}