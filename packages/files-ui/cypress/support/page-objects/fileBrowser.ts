export const fileBrowser = {
  fileItemRow: () => cy.get("[data-cy=file-item-row]", { timeout: 20000 }),
  fileTable: () => cy.get("[data-testid=table-home]"),
  fileItemName: () => cy.get("[data-cy=file-item-name]"),
  fileItemKebabButton: () => cy.get("[data-testid=menu-title-fileDropdown]"),
  noDataStateInfo: () => cy.get("[data-cy=data-state-no-files]")
}
