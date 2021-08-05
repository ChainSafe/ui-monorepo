import { binPage } from "../support/page-objects/binPage"
import { homePage } from "../support/page-objects/homePage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { folderName } from "../fixtures/filesTestData"
import "cypress-pipe"

describe("File management", () => {

  context("desktop", () => {

    it("can create folders and cancel modal", () => {
      cy.web3Login({ clearCSFBucket: true })

      // create a folder and see it in the file list
      homePage.newFolderButton().click()
      homePage.folderNameInput().type(folderName)
      homePage.createButton().safeClick()
      homePage.createFolderModal().should("not.exist")
      homePage.fileItemName().contains(folderName)

      // cancel and ensure that the create folder modal is dismissed
      homePage.newFolderButton().click()
      homePage.cancelButton().click()
      homePage.createFolderModal().should("not.exist")
    })

    it("can add files and cancel modal", () => {
      cy.web3Login()

      // upload a file and see it in the file list
      homePage.uploadButton().click()
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileUploadList().should("have.length", 1)

      // cancel and ensure that the upload modal is dismissed
      homePage.uploadCancelButton().click()
      homePage.uploadCancelButton().should("not.exist")
      homePage.uploadFileForm().should("not.exist")
    })

    it("can add/remove multiple files and upload", () => {
      cy.web3Login({ clearCSFBucket: true })

      // attach 2 files to the file list
      homePage.uploadButton().click()
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileUploadList().should("have.length", 1)
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileUploadList().should("have.length", 2)

      // remove 1 file from the list and ensure 1 remains
      homePage.fileListRemoveButton().first().click()
      homePage.fileUploadList().should("have.length", 1)

      // attach an additional file to the file list and upload
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileUploadList().should("have.length", 2)
      homePage.fileListRemoveButton().should("have.length", 2)
      homePage.startUploadButton().safeClick()
      homePage.uploadFileForm().should("not.exist")
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

    it("can delete and recover a file", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // upload a file 
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 1)

      // retrieve the file's name, store as a cypress alias
      homePage.fileItemName().invoke("text").as("originalFile")

      // delete a file via the menu option 
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      homePage.deleteFileDialog().should("be.visible")
      homePage.deleteFileConfirmButton().click()
      homePage.deleteFileDialog().should("not.exist")
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
      binPage.folderList().should("exist")
      binPage.folderList().contains("Home").click()
      binPage.recoverButton().click()
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
    })

    it("can delete and recover a folder", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // create a folder
      homePage.createFolder(folderName)
      homePage.fileItemRow().should("have.length", 1)

      // delete the folder via the menu option 
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      homePage.deleteFileDialog().should("be.visible")
      homePage.deleteFileConfirmButton().click()
      homePage.deleteFileDialog().should("not.exist")
      homePage.fileItemRow().should("not.exist")

      // confirm the deleted folder is moved to the bin
      navigationMenu.binNavButton().click()
      binPage.fileItemRow().should("have.length", 1)
      binPage.fileItemName().should("have.text", folderName)

      // recover folder via the menu option
      binPage.fileItemKebabButton().first().click()
      binPage.recoverMenuOption().click()
      binPage.folderList().should("exist")
      binPage.folderList().contains("Home").click()
      binPage.recoverButton().click()
      binPage.fileItemRow().should("not.exist")

      // ensure recovered folder is correct
      navigationMenu.homeNavButton().click()
      binPage.fileItemRow().should("have.length", 1)
      homePage.fileItemName().should("have.text", folderName)
    })

    it("cannot create a folder with an invalid name", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
      homePage.newFolderButton().click()

      // ensure a folder can't be created without entering a name
      homePage.createButton().should("have.attr", "disabled")
      homePage.folderNameInput().type("a{selectall}{del}")
      homePage.folderCreationErrorLabel().should("be.visible")

      // ensure a folder can't be created with "/" in the name
      homePage.folderNameInput().type("/")
      homePage.createButton().should("have.attr", "disabled")
      homePage.folderCreationErrorLabel().should("be.visible")
      homePage.createFolderModal().should("contain.text", "A name cannot contain '/' character")

      // ensure a folder can't be created with white space only in the name
      homePage.folderNameInput().type("{selectall}{del}")
      homePage.folderNameInput().type("   ")
      homePage.createButton().should("have.attr", "disabled")
      homePage.folderCreationErrorLabel().should("be.visible")
      homePage.createFolderModal().should("contain.text", "Please enter a name")

      // ensure a folder can't be created if name exceeds 65 characters
      homePage.folderNameInput().type("{selectall}{del}")
      homePage.folderNameInput().type("cgsxffymqivoknhwhqvmnchvjngtwsriovhvkgzgmonmimctcrdytujbtkogngvext")
      homePage.createButton().should("have.attr", "disabled")
      homePage.folderCreationErrorLabel().should("be.visible")
      homePage.createFolderModal().should("contain.text", "Name too long")
    })
  })
})