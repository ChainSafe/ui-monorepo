import { createSharedFolderModal } from "../support/page-objects/modals/createSharedFolderModal"
import { deleteSharedFolderModal } from "../support/page-objects/modals/deleteSharedFolderModal"
import { fileUploadModal } from "../support/page-objects/modals/fileUploadModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { sharingExplainerKey, sharedFolderName, sharedFolderEditedName, validUsername } from "../fixtures/filesTestData"
import { sharedPage } from "../support/page-objects/sharedPage"
import { uploadCompleteToast } from "../support/page-objects/toasts/uploadCompleteToast"
import { viewOnlyShareLink } from "../fixtures/linkData"
import { leaveSharedFolderModal } from "../support/page-objects/modals/leaveSharedFolderModal"
import { linkSharingConfirmation } from "../support/page-objects/linkSharingConfirmation"
import { editSharedFolderModal } from "../support/page-objects/modals/editSharedFolderModal"

describe("File Sharing", () => {

  context("desktop", () => {

    it("can create, add, delete a shared folder", () => {
      // intercept and stub the response to ensure the explainer is not displayed
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login({ deleteShareBucket: true })

      // create a shared folder
      navigationMenu.sharedNavButton().click()
      sharedPage.createSharedFolderButton().click()
      createSharedFolderModal.body().should("be.visible")
      createSharedFolderModal.folderNameInput().type(sharedFolderName)
      createSharedFolderModal.createButton().safeClick()
      editSharedFolderModal.editPermissionInput().type(validUsername)
      editSharedFolderModal.userLookupResult().should("exist").click()
      editSharedFolderModal.updateButton().safeClick()
      editSharedFolderModal.body().should("not.exist")
      sharedPage.sharedFolderItemRow().should("have.length", 1)

      // upload to a shared folder
      sharedPage.sharedFolderItemName().contains(sharedFolderName)
        .should("be.visible")
        .dblclick()
      sharedPage.uploadButton().click()
      fileUploadModal.body().attachFile("../fixtures/uploadedFiles/text-file.txt")
      fileUploadModal.fileList().should("have.length", 1)
      fileUploadModal.uploadButton().safeClick()
      fileUploadModal.body().should("not.exist")
      uploadCompleteToast.body().should("be.visible")
      uploadCompleteToast.closeButton().click()
      sharedPage.fileItemRow().should("have.length", 1)

      // edit name of a shared folder
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemRow().should("have.length", 1)
      sharedPage.fileItemKebabButton().click()
      sharedPage.renameMenuOption().click()
      sharedPage.shareRenameInput()
        .type("{selectall}{del}")
        .type(`${sharedFolderEditedName}{enter}`)
      sharedPage.sharedFolderItemName().contains(sharedFolderEditedName)

      // delete a shared folder
      sharedPage.fileItemKebabButton().click()
      sharedPage.deleteMenuOption().click()
      deleteSharedFolderModal.body().should("be.visible")
      deleteSharedFolderModal.confirmButton().safeClick()
      deleteSharedFolderModal.body().should("not.exist")
      sharedPage.sharedFolderItemRow().should("not.exist")
    })

    it("can leave a shared folder", () => {
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login({ deleteShareBucket: true })
      cy.visit(viewOnlyShareLink)
      linkSharingConfirmation.viewAccessConfirmationLabel().should("be.visible")
      navigationMenu.sharedNavButton().click()

      // leave the shared folder
      sharedPage.fileItemKebabButton().click()
      sharedPage.leaveMenuOption().click()
      leaveSharedFolderModal.body().should("be.visible")
      leaveSharedFolderModal.confirmButton().safeClick()

      // ensure the shared folder is no longer shown on the main share page
      sharedPage.sharedFolderItemRow().should("have.length", 0)
    })
  })
})
