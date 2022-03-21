import { createSharedFolderModal } from "../support/page-objects/modals/createSharedFolderModal"
import { deleteSharedFolderModal } from "../support/page-objects/modals/deleteSharedFolderModal"
import { fileUploadModal } from "../support/page-objects/modals/fileUploadModal"
import { homePage } from "../support/page-objects/homePage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { sharedFolderName, sharedFolderEditedName } from "../fixtures/filesTestData"
import { sharingExplainerKey, validUsernameA, validEthAddress, validShareKey } from "../fixtures/filesTestData"
import { sharedPage } from "../support/page-objects/sharedPage"
import { uploadCompleteToast } from "../support/page-objects/toasts/uploadCompleteToast"
import { viewOnlyShareLink } from "../fixtures/linkData"
import { leaveSharedFolderModal } from "../support/page-objects/modals/leaveSharedFolderModal"
import { linkSharingConfirmation } from "../support/page-objects/linkSharingConfirmation"
import { editSharedFolderModal } from "../support/page-objects/modals/editSharedFolderModal"
import { shareFileModal } from "../support/page-objects/modals/shareFileModal"
import { sharingProgressToast } from "../support/page-objects/toasts/sharingProgressToast"
import { shareSuccessToast } from "../support/page-objects/toasts/shareSuccessToast"

describe("File Sharing", () => {

  beforeEach(() => {
    // intercept and stub the response to ensure the explainer is not displayed
    cy.intercept("GET", "**/user/store", {
      body: { [sharingExplainerKey]: "true" }
    })
  })

  context("desktop", () => {

    it("can create, add, delete a shared folder", () => {
      cy.web3Login({ deleteShareBucket: true })

      // create a shared folder
      navigationMenu.sharedNavButton().click()
      sharedPage.createSharedFolderButton().click()
      createSharedFolderModal.body().should("be.visible")
      createSharedFolderModal.folderNameInput().type(sharedFolderName)
      createSharedFolderModal.createButton().safeClick()
      editSharedFolderModal.editPermissionInput().type(validUsernameA)
      editSharedFolderModal.userLookupResult().should("exist").click()
      editSharedFolderModal.updateButton().safeClick()
      editSharedFolderModal.body().should("not.exist")
      sharedPage.sharedFolderItemRow().should("have.length", 1)

      // ensure share row contains all expected elements
      sharedPage.sharedFolderItemRow().within(() => {
        sharedPage.sharedFolderIcon().should("be.visible")
        sharedPage.sharedFolderItemName().should("be.visible")
        sharedPage.shareOwnerCell().should("be.visible")
        sharedPage.sharedWithCell().should("be.visible")
        sharedPage.sharedFolderSizeCell().should("be.visible")
      })

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

    it("can add and remove users to the share modal", () => {
      cy.web3Login({ deleteShareBucket: true })

      // create a shared folder
      navigationMenu.sharedNavButton().click()
      sharedPage.createSharedFolderButton().click()
      createSharedFolderModal.body().should("be.visible")
      createSharedFolderModal.folderNameInput().type(sharedFolderName)
      createSharedFolderModal.createButton().safeClick()

      // add to share via a username
      editSharedFolderModal.editPermissionInput().type(validUsernameA)
      editSharedFolderModal.userLookupResult().should("exist").click()
      editSharedFolderModal.addedUserBox().should("have.length", 1)

      // ensure user wrapper contains all expected elements
      editSharedFolderModal.addedUserBox().within(() => {
        editSharedFolderModal.addedUserIcon().should("have.length", 1)
        editSharedFolderModal.addedUserName().should("have.length", 1)
        editSharedFolderModal.userPermissionDropDown().should("have.length", 1)
      })

      // add to share via an ethereum address
      editSharedFolderModal.editPermissionInput().type(validEthAddress)
      editSharedFolderModal.userLookupResult().should("exist").click()
      editSharedFolderModal.addedUserBox().should("have.length", 2)

      // add to share via a sharekey
      editSharedFolderModal.editPermissionInput().type(validShareKey)
      editSharedFolderModal.userLookupResult().should("exist").click()
      editSharedFolderModal.addedUserBox().should("have.length", 3)

      // remove added users
      editSharedFolderModal.removeUserButton().first().click()
      editSharedFolderModal.addedUserBox().should("have.length", 2)
      editSharedFolderModal.removeUserButton().first().click()
      editSharedFolderModal.addedUserBox().should("have.length", 1)
      editSharedFolderModal.removeUserButton().first().click()
      editSharedFolderModal.addedUserBox().should("not.exist")
    })

    it("can update user permissions and save changes", () => {
      cy.web3Login({ deleteShareBucket: true })

      // create a shared folder
      navigationMenu.sharedNavButton().click()
      sharedPage.createSharedFolderButton().click()
      createSharedFolderModal.body().should("be.visible")
      createSharedFolderModal.folderNameInput().type(sharedFolderName)
      createSharedFolderModal.createButton().safeClick()

      // add a user to share
      editSharedFolderModal.editPermissionInput().type(validUsernameA)
      editSharedFolderModal.userLookupResult().should("exist").click()
      editSharedFolderModal.addedUserBox().should("have.length", 1)

      // ensure default access should be "view-only"
      editSharedFolderModal.userPermissionDropDown().should("contain.text", "view")

      // change access to "can-edit" and save changes
      editSharedFolderModal.userPermissionDropDown().click()
      editSharedFolderModal.userCanEditDropdownOption().click()
      editSharedFolderModal.updateButton().safeClick()

      // re-open and ensure changes were saved
      sharedPage.fileItemKebabButton()
        .should("be.visible")
        .click()
      sharedPage.manageAccessMenuOption().click()
      editSharedFolderModal.body().should("be.visible")
      editSharedFolderModal.userPermissionDropDown().should("contain.text", "edit")
    })

    it("can copy a file to a new shared folder and preserve original", () => {
      cy.web3Login({ deleteShareBucket: true, clearCSFBucket: true })

      // upload a file and store it's name as cypress alias
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileItemName().invoke("text").as("fileName")

      // share file to newly created share folder
      homePage.fileItemKebabButton().click()
      homePage.shareMenuOption().click()
      shareFileModal.body().should("be.visible")
      shareFileModal.shareNameInput().type(sharedFolderName)
      shareFileModal.copyOverButton().click()
      sharingProgressToast.body().should("be.visible")
      shareSuccessToast.body().should("be.visible")
      shareSuccessToast.closeButton().click()
      editSharedFolderModal.closeButton().click()

      // ensure file remained in drive after copying
      homePage.fileItemRow().should("have.length", 1)

      // go to the new share and ensure file was copied there
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemName().contains(sharedFolderName)
        .should("be.visible")
        .dblclick()
      sharedPage.fileItemRow().should("have.length", 1)

      // ensure file name of copied file is correct
      cy.get("@fileName").then(($fileName) => {
        sharedPage.fileItemName().contains(`${$fileName}`).should("be.visible")
      })
    })

    it("can copy a file to a new shared folder and delete original", () => {
      cy.web3Login({ deleteShareBucket: true, clearCSFBucket: true })

      // upload a file and store it's name as cypress alias
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileItemName().invoke("text").as("fileName")

      // share file to newly created share folder
      homePage.fileItemKebabButton().click()
      homePage.shareMenuOption().click()
      shareFileModal.body().should("be.visible")
      shareFileModal.shareNameInput().type(sharedFolderName)
      // click to unmark checkbox, selected by default
      shareFileModal.keepOriginalFilesCheckbox().click()
      shareFileModal.copyOverButton().click()
      sharingProgressToast.body().should("be.visible")
      shareSuccessToast.body().should("be.visible")
      shareSuccessToast.closeButton().click()
      editSharedFolderModal.closeButton().click()

      // ensure the file did not remain in the drive after copying
      homePage.fileItemRow().should("have.length", 0)

      // go to the new share and ensure file was copied there
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemName().contains(sharedFolderName)
        .should("be.visible")
        .dblclick()
      sharedPage.fileItemRow().should("have.length", 1)

      // ensure file name of copied file is correct
      cy.get("@fileName").then(($fileName) => {
        sharedPage.fileItemName().contains(`${$fileName}`).should("be.visible")
      })
    })

    it.only("can copy a file to a pre-existing shared folder and preserve original", () => {
      cy.web3Login({ deleteShareBucket: true, clearCSFBucket: true })

      navigationMenu.sharedNavButton().click()
      sharedPage.createSharedFolder()

      // upload a file and store it's name as cypress alias
      navigationMenu.homeNavButton().click()
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileItemName().invoke("text").as("fileName")

      // share file to newly created share folder
      homePage.fileItemKebabButton().click()
      homePage.shareMenuOption().click()
      shareFileModal.body().should("be.visible")
      shareFileModal.selectFolderInput().click()
      shareFileModal.existingFolderInputOption()
        .contains(sharedFolderName)
        .click()
      //shareFileModal.selectFolderInput().type(`${sharedFolderName}{enter}`)
      shareFileModal.copyOverButton().click()
      sharingProgressToast.body().should("be.visible")
      shareSuccessToast.body().should("be.visible")
      shareSuccessToast.closeButton().click()

      // ensure file remained in drive after copying
      homePage.fileItemRow().should("have.length", 1)

      // go to the new share and ensure file was copied there
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemName().contains(sharedFolderName)
        .should("be.visible")
        .dblclick()
      sharedPage.fileItemRow().should("have.length", 1)

      // ensure file name of copied file is correct
      cy.get("@fileName").then(($fileName) => {
        sharedPage.fileItemName().contains(`${$fileName}`).should("be.visible")
      })
    })

    it("can copy a file to a pre-existing shared folder and delete original", () => {
      cy.web3Login({ deleteShareBucket: true, clearCSFBucket: true })

      navigationMenu.sharedNavButton().click()
      sharedPage.createSharedFolder()

      // upload a file and store it's name as cypress alias
      navigationMenu.homeNavButton().click()
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileItemName().invoke("text").as("fileName")

      // share file to newly created share folder
      homePage.fileItemKebabButton().click()
      homePage.shareMenuOption().click()
      shareFileModal.body().should("be.visible")
      shareFileModal.selectFolderInput().click()
      // shareFileModal.existingFolderInputOption()
      //   .contains(sharedFolderName)
      //   .click()
      shareFileModal.selectFolderInput().type(`${sharedFolderName}{enter}`)
      shareFileModal.keepOriginalFilesCheckbox().click()
      shareFileModal.moveOverButton().click()
      sharingProgressToast.body().should("be.visible")
      shareSuccessToast.body().should("be.visible")
      shareSuccessToast.closeButton().click()

      // ensure file was deleted from drive after copying
      homePage.fileItemRow().should("have.length", 0)

      // go to the new share and ensure file was copied there
      navigationMenu.sharedNavButton().click()
      sharedPage.sharedFolderItemName().contains(sharedFolderName)
        .should("be.visible")
        .dblclick()
      sharedPage.fileItemRow().should("have.length", 1)

      // ensure file name of copied file is correct
      cy.get("@fileName").then(($fileName) => {
        sharedPage.fileItemName().contains(`${$fileName}`).should("be.visible")
      })
    })

  })
})
