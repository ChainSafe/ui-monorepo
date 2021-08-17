import { binPage } from "../support/page-objects/binPage"
import { homePage } from "../support/page-objects/homePage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { folderName } from "../fixtures/filesTestData"
import "cypress-pipe"
import { createFolderModal } from "../support/page-objects/modals/createFolderModal"
import { deleteFileModal } from "../support/page-objects/modals/deleteFileModal"
import { fileUploadModal } from "../support/page-objects/modals/fileUploadModal"
import { moveItemModal } from "../support/page-objects/modals/moveItemModal"
import { recoverItemModal } from "../support/page-objects/modals/recoverItemModal"

describe("File management", () => {

  context("desktop", () => {

    it("can create folders and cancel modal", () => {
      cy.web3Login({ clearCSFBucket: true })

      // create a folder and see it in the file list
      homePage.newFolderButton().click()
      createFolderModal.folderNameInput().type(folderName)
      createFolderModal.createButton().safeClick()
      createFolderModal.body().should("not.exist")
      homePage.fileItemName().contains(folderName)

      // cancel and ensure that the create folder modal is dismissed
      homePage.newFolderButton().click()
      createFolderModal.cancelButton().click()
      createFolderModal.body().should("not.exist")
    })

    it("can add files and cancel modal", () => {
      cy.web3Login()

      // upload a file and see it in the file list
      homePage.uploadButton().click()
      fileUploadModal.body().attachFile("../fixtures/uploadedFiles/text-file.txt")
      fileUploadModal.fileList().should("have.length", 1)

      // cancel and ensure that the upload modal is dismissed
      fileUploadModal.cancelButton().click()
      fileUploadModal.body().should("not.exist")
    })

    it.only("can move a file in and out of a folder", () => {
      cy.web3Login({ clearCSFBucket: true })

      // upload a file and save it's name as a cypress alias
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 1)
      homePage.fileItemName().invoke("text").as("fileName")

      // create a folder 
      homePage.createFolder(folderName)
      homePage.fileItemRow().should("have.length", 2)

      cy.get("@fileName").then(($fileName) => {
        // select the file and move it to the folder
        homePage.fileItemName().contains(`${$fileName}`)
          .should("be.visible")
          .click()
        homePage.moveSelectedButton().click()
        moveItemModal.folderList().contains("Testing").click()
        moveItemModal.moveButton().safeClick()

        // ensure there is only the folder in the Home directory 
        homePage.fileItemRow().should("have.length", 1)
        homePage.fileItemName().should("contain.text", folderName)

        // open the folder and confirm the file was moved inside
        homePage.fileItemName().contains(folderName)
          .should("be.visible")
          .dblclick()
        homePage.fileItemRow().should("have.length", 1)
        homePage.fileItemName().should("contain.text", $fileName)

        // move the file back to the home root
        homePage.fileItemName().contains(`${$fileName}`)
          .should("be.visible")
          .click()
        homePage.moveSelectedButton().click()
        moveItemModal.folderList().contains("Home").click()
        moveItemModal.moveButton().safeClick()

        // ensure the home root now has the folder and file
        navigationMenu.homeNavButton().click()
        homePage.fileItemRow().should("have.length", 2)
        homePage.fileItemName().should("contain.text", folderName)
        homePage.fileItemName().should("contain.text", $fileName)
      })
    })


    it("can add/remove multiple files and upload", () => {
      cy.web3Login({ clearCSFBucket: true })

      // attach 2 files to the file list
      homePage.uploadButton().click()
      fileUploadModal.body().attachFile("../fixtures/uploadedFiles/text-file.txt")
      fileUploadModal.fileList().should("have.length", 1)
      fileUploadModal.body().attachFile("../fixtures/uploadedFiles/logo.png")
      fileUploadModal.fileList().should("have.length", 2)

      // remove 1 file from the list and ensure 1 remains
      fileUploadModal.removeFileButton().first().click()
      fileUploadModal.fileList().should("have.length", 1)

      // attach an additional file to the file list and upload
      fileUploadModal.body().attachFile("../fixtures/uploadedFiles/text-file.txt")
      fileUploadModal.fileList().should("have.length", 2)
      fileUploadModal.removeFileButton().should("have.length", 2)
      fileUploadModal.uploadButton().safeClick()
      fileUploadModal.body().should("not.exist")
      homePage.fileItemRow().should("have.length", 2)
    })

    it("can rename a file with error handling", () => {
      const newName = "awesome new name"

      cy.web3Login({ clearCSFBucket: true })

      // upload a file 
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 1)

      // ensure an error is displayed if the edited name is blank
      homePage.fileItemKebabButton().first().click()
      homePage.renameMenuOption().click()
      homePage.fileRenameInput().type("{selectall}{del}")
      homePage.fileRenameErrorLabel().should("be.visible")

      // rename a file
      homePage.fileRenameInput().type(`${newName}{enter}`)
      homePage.fileItemName().contains(newName)

      // ensure the original name persists if the rename submission is blank
      homePage.fileItemKebabButton().first().click()
      homePage.renameMenuOption().click()
      homePage.fileRenameInput().type("{selectall}{del}{esc}")
      homePage.fileRenameInput().should("not.exist")
      homePage.fileItemName().contains(newName)

      // ensure that the name is reset when renaming is canceled
      homePage.fileItemKebabButton().first().click()
      homePage.renameMenuOption().click()
      homePage.fileRenameInput().type("{selectall}abc{del}{esc}")
      homePage.fileRenameInput().should("not.exist")
      homePage.fileItemKebabButton().first().click()
      homePage.renameMenuOption().click()
      homePage.fileRenameInput().should("have.value", newName)
    })

    it("can delete, recover and permanently delete a file", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // upload a file 
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 1)

      // retrieve the file's name, store as a cypress alias
      homePage.fileItemName().invoke("text").as("originalFile")

      // delete a file via the menu option 
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      deleteFileModal.body().should("be.visible")
      deleteFileModal.confirmButton().safeClick()
      deleteFileModal.body().should("not.exist")
      homePage.fileItemRow().should("not.exist")

      // confirm the deleted file is moved to the bin
      navigationMenu.binNavButton().click()
      homePage.fileItemRow().should("have.length", 1)

      // retrieve the deleted file's name, store as a cypress alias
      binPage.fileItemName().invoke("text").as("binFile")

      // ensure file in bin matches the name of the deleted file
      cy.get("@originalFile").then(($originalFile) => {
        cy.get("@binFile").should("equals", $originalFile)
      })

      // recover the file via the menu option
      binPage.fileItemKebabButton().first().click()
      binPage.recoverMenuOption().click()
      recoverItemModal.folderList().should("exist")
      recoverItemModal.folderList().contains("Home").click()
      recoverItemModal.recoverButton().click()
      binPage.fileItemRow().should("not.exist")

      // ensure recovered file is correct
      navigationMenu.homeNavButton().click()
      // retrieve the recovered file's name, store as a cypress alias
      homePage.fileItemName().invoke("text").as("recoveredFile")

      binPage.fileItemRow().should("have.length", 1)

      // ensure file moved from the bin matches the name of the recovered file
      cy.get("@recoveredFile").then(($recoveredFile) => {
        cy.get("@binFile").should("equals", $recoveredFile)
      })

      // permanently delete the file
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click().pause()
      deleteFileModal.confirmButton().safeClick()
      navigationMenu.binNavButton().click()
      binPage.fileItemKebabButton().first().click()
      binPage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      binPage.fileItemRow().should("not.exist")
      navigationMenu.homeNavButton().click()
      homePage.fileItemRow().should("not.exist")
    })

    it("can delete, recover and permanently delete a folder", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // create a folder
      homePage.createFolder(folderName)
      homePage.fileItemRow().should("have.length", 1)

      // delete the folder via the menu option 
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      deleteFileModal.body().should("be.visible")
      deleteFileModal.confirmButton().safeClick()
      deleteFileModal.body().should("not.exist")
      homePage.fileItemRow().should("not.exist")

      // confirm the deleted folder is moved to the bin
      navigationMenu.binNavButton().click()
      binPage.fileItemRow().should("have.length", 1)
      binPage.fileItemName().should("have.text", folderName)

      // recover folder via the menu option
      binPage.fileItemKebabButton().first().click()
      binPage.recoverMenuOption().click()
      recoverItemModal.folderList().should("exist")
      recoverItemModal.folderList().contains("Home").click()
      recoverItemModal.recoverButton().click()
      binPage.fileItemRow().should("not.exist")

      // ensure recovered folder is correct
      navigationMenu.homeNavButton().click()
      binPage.fileItemRow().should("have.length", 1)
      homePage.fileItemName().should("have.text", folderName)

      // permanently delete the folder
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      navigationMenu.binNavButton().click()
      binPage.fileItemKebabButton().first().click()
      binPage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      binPage.fileItemRow().should("not.exist")
      navigationMenu.homeNavButton().click()
      homePage.fileItemRow().should("not.exist")
    })

    it("cannot create a folder with an invalid name", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
      homePage.newFolderButton().click()

      // ensure a folder can't be created without entering a name
      createFolderModal.createButton().should("have.attr", "disabled")
      createFolderModal.folderNameInput().type("a{selectall}{del}")
      createFolderModal.errorLabel().should("be.visible")

      // ensure a folder can't be created with "/" in the name
      createFolderModal.folderNameInput().type("/")
      createFolderModal.createButton().should("have.attr", "disabled")
      createFolderModal.errorLabel().should("be.visible")
      createFolderModal.body().should("contain.text", "A name cannot contain '/' character")

      // ensure a folder can't be created with white space only in the name
      createFolderModal.folderNameInput().type("{selectall}{del}")
      createFolderModal.folderNameInput().type("   ")
      createFolderModal.createButton().should("have.attr", "disabled")
      createFolderModal.errorLabel().should("be.visible")
      createFolderModal.body().should("contain.text", "Please enter a name")

      // ensure a folder can't be created if name exceeds 65 characters
      createFolderModal.folderNameInput().type("{selectall}{del}")
      createFolderModal.folderNameInput().type("cgsxffymqivoknhwhqvmnchvjngtwsriovhvkgzgmonmimctcrdytujbtkogngvext")
      createFolderModal.createButton().should("have.attr", "disabled")
      createFolderModal.errorLabel().should("be.visible")
      createFolderModal.body().should("contain.text", "Name too long")
    })
  })
})
