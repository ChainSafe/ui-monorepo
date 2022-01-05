export const previewModal = {
  body: () => cy.get("[data-cy=modal-container-preview]", { timeout: 10000 }),
  closeButton: () => cy.get("[data-cy=button-close-preview]"),
  contentContainer: () => cy.get("[data-cy=container-content-preview]", { timeout: 10000 }),
  downloadFileButton: () => cy.get("[data-cy=button-download-previewed-file]"),
  downloadUnsupportedFileButton: () => cy.get("[data-cy=button-download-unsupported-file]", { timeout: 10000 }),
  fileNameLabel: () => cy.get("[data-cy=label-previewed-file-name]"),
  fullScreenButton: () => cy.get("[data-cy=button-full-screen]"),
  nextFileButton: () => cy.get("[data-cy=button-view-next-file]"),
  previewKebabButton: () => cy.get("[data-testId=icon-preview-kebab]"),
  previousFileButton: () => cy.get("[data-cy=button-view-previous-file]"),
  unsupportedFileLabel: () => cy.get("[data-cy=label-unsupported-file-message]", { timeout: 10000 }),
  ZoomInButton: () => cy.get("[data-cy=button-zoom-in]"),
  zoomOutButton: () => cy.get("[data-cy=button-zoom-out]")
}