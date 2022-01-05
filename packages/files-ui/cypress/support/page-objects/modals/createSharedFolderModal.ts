export const createEditSharedFolderModal = {
  body: () => cy.get("[data-testId=modal-container-create-or-edit-shared-folder]", { timeout: 10000 }),
  cancelButton: () => cy.get("[data-cy=button-cancel-create-shared-folder]"),
  createButton: () => cy.get("[data-cy=button-create-shared-folder]", { timeout: 10000 }),
  editPermissionInput: () => cy.get("[data-cy=input-edit-permission]"),
  folderNameInput: () => cy.get("[data-cy=input-shared-folder-name]"),
  tagViewPermissionUser: () => cy.get("[data-cy=tag-view-permission-user]"),
  tagEditPermissionUser: () => cy.get("[data-cy=tag-edit-permission-user]"),
  updateButton: () => cy.get("[data-cy=button-update-shared-folder]", { timeout: 10000 }),
  viewOnlyPermissionInput: () => cy.get("[data-cy=input-view-permission"),

  // link sharing related elements
  shareLink: () => cy.get("[data-cy=link-share]"),
  activeShareLink: () => cy.get("[data-cy=link-active-share]"),
  labelPermissionType: () => cy.get("[data-cy=label-permission-type]"),
  copyLinkButton: () => cy.get("[data-cy=button-copy-link]"),
  linkKebabMenu: () => cy.get("[data-testId=icon-link-kebab]"),
  deleteLinkMenuOption: () => cy.get("[data-cy=menu-delete-active-link]"),
  permissionTypeDropdown: () => cy.get("[data-testId=dropdown-title-permission]"),
  viewOnlyDropdownOption: () => cy.get("[data-cy=menu-read]"),
  canEditDropdownOption: () => cy.get("[data-cy=menu-write]"),
  createLinkButton: () => cy.get("[data-cy=button-create-link]")
}
