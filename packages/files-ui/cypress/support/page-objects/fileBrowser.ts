export const fileBrowser = {
  fileItemKebabButton: () => cy.get("[data-testid=icon-file-item-kebab]", { timeout: 10000 }),
  fileItemName: () => cy.get("[data-cy=label-file-item-name]"),
  fileItemRow: () => cy.get("[data-cy=row-file-item]", { timeout: 20000 }),
  fileTable: () => cy.get("[data-testid=table-home]"),
  folderBreadcrumb: () => cy.get("[data-cy=breadcrumb-folder-navigation]"),
  noDataStateInfo: () => cy.get("[data-cy=container-no-files-data-state]")
}
