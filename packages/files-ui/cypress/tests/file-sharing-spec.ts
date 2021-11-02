import { createEditSharedFolderModal } from "../support/page-objects/modals/createSharedFolderModal"
import { fileUploadModal } from "../support/page-objects/modals/fileUploadModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { sharingExplainerKey, sharedFolderName } from "../fixtures/filesTestData"
import { sharedPage } from "../support/page-objects/sharedPage"
import { uploadCompleteToast } from "../support/page-objects/toasts/uploadCompleteToast"

describe("File Sharing", () => {

  context("desktop", () => {

    it("can create, add, delete a shared folder", () => {
      // intercept and stub the response to ensure the explainer is not displayed
      cy.intercept("GET", "**/user/store", {
        body: { [sharingExplainerKey]: "true" }
      })

      cy.web3Login({ deleteShareBucket: true })

      // create shared folder
      navigationMenu.sharedNavButton().click()

      sharedPage.createSharedFolderButton().click()
      createEditSharedFolderModal.body().should("be.visible")

      createEditSharedFolderModal.folderNameInput().type(sharedFolderName)
      createEditSharedFolderModal.editPermissionInput().type("walletboy").type("{enter}")
      createEditSharedFolderModal.createButton().safeClick()
      createEditSharedFolderModal.body().should("not.exist")

      // upload to a shared folder
      sharedPage.fileItemName().contains(sharedFolderName)
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

      // delete a shared folder

    })
  })
})