export const createEditSharedFolderModal = {
  body: () => cy.get("[data-testid=modal-container-create-or-edit-shared-folder]", { timeout: 10000 }),
  cancelButton: () => cy.get("[data-cy=button-cancel-create-shared-folder]"),
  createButton: () => cy.get("[data-cy=button-create-shared-folder]", { timeout: 10000 }),
  editPermissionInput: () => cy.get("[data-cy=input-edit-permission]"),
  folderNameInput: () => cy.get("[data-cy=input-shared-folder-name]"),
  tagViewPermissionUser: () => cy.get("[data-cy=tag-view-permission-user]"),
  tagEditPermissionUser: () => cy.get("[data-cy=tag-edit-permission-user]"),
  updateButton: () => cy.get("[data-cy=button-update-shared-folder]", { timeout: 10000 }),
  viewOnlyPermissionInput: () => cy.get("[data-cy=input-view-permission")
}