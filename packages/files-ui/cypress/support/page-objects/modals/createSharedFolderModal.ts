export const createSharedFolderModal = {
  body: () => cy.get("[data-testid=modal-container-create-shared-folder]", { timeout: 10000 }),
  cancelButton: () => cy.get("[data-cy=button-cancel-create-shared-folder]"),
  createButton: () => cy.get("[data-cy=button-create-shared-folder]", { timeout: 10000 }),
  // editPermissionInput: () => cy.get("[data-cy=input-edit-permission]"),
  folderNameInput: () => cy.get("[data-cy=input-shared-folder-name]")
  // updateButton: () => cy.get("[data-cy=button-update-shared-folder]", { timeout: 10000 }),
  // userLookupResult: () => cy.get("[data-cy=user-lookup-result]", { timeout: 10000 }),
  // // link sharing related elements
  // shareLink: () => cy.get("[data-cy=link-share]"),
  // activeShareLink: () => cy.get("[data-cy=link-active-share]"),
  // labelPermissionType: () => cy.get("[data-cy=label-permission-type]"),
  // copyLinkButton: () => cy.get("[data-cy=button-copy-link]"),
  // linkKebabMenu: () => cy.get("[data-testid=icon-link-kebab]"),
  // deleteLinkMenuOption: () => cy.get("[data-cy=menu-delete-active-link]"),
  // linkPermissionDropdown: () => cy.get("[data-testid=dropdown-title-link-permission]"),
  // viewOnlyDropdownOption: () => cy.get("[data-testid=dropdown-link-permission-read]"),
  // canEditDropdownOption: () => cy.get("[data-testid=dropdown-link-permission-write]"),
  // createLinkButton: () => cy.get("[data-cy=button-create-link]")
}
