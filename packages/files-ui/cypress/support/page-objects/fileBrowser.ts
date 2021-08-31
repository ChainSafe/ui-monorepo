export const fileBrowser = {
  fileItemKebabButton: () => cy.get("[data-testid=menu-title-fileDropdown]"),
  fileItemName: () => cy.get("[data-cy=file-item-name]"),
  fileItemRow: () => cy.get("[data-cy=file-item-row]", { timeout: 20000 }),
  fileTable: () => cy.get("[data-testid=table-home]"),
  folderBreadcrumb: () => cy.get("[data-cy=navigation-folder-breadcrumb]"),
  noDataStateInfo: () => cy.get("[data-cy=data-state-no-files]")
}
