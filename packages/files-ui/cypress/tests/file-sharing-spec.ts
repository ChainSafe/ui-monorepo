import { createEditSharedFolderModal } from "../support/page-objects/modals/createSharedFolderModal"
import { sharedPage } from "../support/page-objects/sharedPage"
import { navigationMenu } from "../support/page-objects/navigationMenu"

describe("File Sharing", () => {

  context("desktop", () => {

    it("can create a shared folder and upload to it", () => {
      cy.web3Login({ clearCSFBucket: true })

      navigationMenu.sharedNavButton().click()

      sharedPage.createSharedFolderButton().click()
      createEditSharedFolderModal.body().should("be.visible")

      createEditSharedFolderModal.folderNameInput().type("SharingTest")
      createEditSharedFolderModal.editPermissionInput().type("walletboy").type("{enter}")
      createEditSharedFolderModal.createButton().safeClick()
      createEditSharedFolderModal.body().should("not.exist")


      //   // create a folder and see it in the file list
      //   homePage.newFolderButton().click()
      //   createFolderModal.folderNameInput().type(folderName)
      //   createFolderModal.createButton().safeClick()
      //   createFolderModal.body().should("not.exist")
      //   homePage.fileItemName().contains(folderName)

    //   // cancel and ensure that the create folder modal is dismissed
    //   homePage.newFolderButton().click()
    //   createFolderModal.cancelButton().click()
    //   createFolderModal.body().should("not.exist")
    })
  })
})