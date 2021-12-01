import { sharedFolderName } from "../../fixtures/filesTestData"
import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"
import { createEditSharedFolderModal } from "./modals/createSharedFolderModal"

export const sharedPage = {
  ...basePage,
  ...fileBrowser,

  createSharedFolderButton: () => cy.get("[data-cy=button-create-a-shared-folder]"),
  sharedFolderItemName: () => cy.get("[data-cy=shared-folder-item-name]"),
  sharedFolderItemRow: () => cy.get("[data-cy=shared-folder-item-row]", { timeout: 20000 }),
  shareRenameInput: () => cy.get("[data-cy=input-rename-share]"),

  // kebab menu elements
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]"),
  leaveMenuOption: () => cy.get("[data-cy=menu-leave]"),
  manageAccessMenuOption: () => cy.get("[data-cy=menu-manage-access]"),
  renameMenuOption: () => cy.get("[data-cy=menu-rename]"),
  uploadButton: () => cy.get("[data-cy=button-upload-file]"),

  // helpers and convenience functions
  createSharedFolder() {
    sharedPage.createSharedFolderButton().click()
    createEditSharedFolderModal.body().should("be.visible")
    createEditSharedFolderModal.folderNameInput().type(sharedFolderName)
    createEditSharedFolderModal.createButton().safeClick()
    createEditSharedFolderModal.body().should("not.exist")
    sharedPage.sharedFolderItemRow().should("have.length", 1)
  }
}
