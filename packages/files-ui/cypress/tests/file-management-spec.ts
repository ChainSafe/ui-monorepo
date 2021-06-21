import { binPage } from "../support/page-objects/binPage"
import { homePage } from "../support/page-objects/homePage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import "cypress-pipe"

describe("File management", () => {

  context("desktop", () => {

    it("can add files and cancel", () => {
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
      homePage.clickUploadButton()
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
    })

    it("can delete a single file", () => {
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
      binPage.fileItemName().invoke("text").as("deletedFile")

      // ensure file in bin matches the name of the deleted file
      cy.get("@originalFile").then(($originalFile) => {
        cy.get("@deletedFile").should("equals", $originalFile)
      })
    })
  })
})
