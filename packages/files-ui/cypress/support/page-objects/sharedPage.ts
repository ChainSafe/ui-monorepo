import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"

export const sharedPage = {
  ...basePage,
  ...fileBrowser,

  createSharedFolderButton: () => cy.get("[data-cy=button-create-a-shared-folder]"),

  // kebab menu elements
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]"),
  leaveMenuOption: () => cy.get("[data-cy=menu-leave]"),
  manageAccessMenuOption: () => cy.get("[data-cy=menu-manage-access]"),
  renameMenuOption: () => cy.get("[data-cy=menu-rename]"),
  uploadButton: () => cy.get("[data-cy=button-upload-file]")
}
