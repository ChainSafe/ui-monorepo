import { sharedFolderName } from "../../fixtures/filesTestData"
import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"
import { createSharedFolderModal } from "./modals/createSharedFolderModal"
import { editSharedFolderModal } from "./modals/editSharedFolderModal"

export const sharedPage = {
  ...basePage,
  ...fileBrowser,

  createSharedFolderButton: () => cy.get("[data-cy=button-create-a-shared-folder]"),
  sharedFolderItemName: () => cy.get("[data-cy=cell-shared-folder-item-name]"),
  sharedFolderItemRow: () => cy.get("[data-cy=row-shared-folder-item]", { timeout: 20000 }),
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
    createSharedFolderModal.body().should("be.visible")
    createSharedFolderModal.folderNameInput().type(sharedFolderName)
    createSharedFolderModal.createButton().safeClick()
    editSharedFolderModal.cancelButton().safeClick()
    createSharedFolderModal.body().should("not.exist")
    sharedPage.sharedFolderItemRow().should("have.length", 1)
  }
}
