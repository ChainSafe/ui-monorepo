import { homePage } from "../support/page-objects/homePage"

describe("File management", () => {

  context("desktop", () => {

    it("can add files and cancel", () => {
      cy.web3Login()
      homePage.uploadButton().click()
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileUploadList().should("have.length", 1)
      homePage.uploadCancelButton().click()
      homePage.uploadCancelButton().should("not.exist")
      cy.get("[data-cy=files-app-header").should("be.visible")
    })

    it("can add/remove files and upload", () => {
      cy.web3Login({ clearCSFBucket: true })
      homePage.uploadButton().click()
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileUploadList().should("have.length", 1)
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileUploadList().should("have.length", 2)
      cy.get("[data-testid=file-list-close-button-fileUpload]").first().click()
      homePage.fileUploadList().should("have.length", 1)
      homePage.uploadFileForm().attachFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileUploadList().should("have.length", 2)
      homePage.startUploadButton().click()
      //cy.get("[data-cy=files-app-header]").should("be.visible")
      homePage.fileItemRow().should("have.length", 2)
    })

    it("can rename a file with error handling", () => {
      const newName = "awesome new name"

      Cypress._.times(1, (k) => {
        cy.web3Login({ clearCSFBucket: true })

        // add file 
        homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
        homePage.fileItemRow().should("have.length", 1)

        // ensure error is displayed if edited name is blank
        homePage.fileItemKebabButton().first().click()
        homePage.renameMenuOption().click()
        homePage.fileRenameInput().type("{selectall}{del}")
        homePage.fileRenameErrorLabel().should("be.visible")

        // rename a file
        homePage.fileRenameInput().type(`${newName}{enter}`)
        homePage.fileItemName().contains(newName)

        // rename file
        homePage.fileItemKebabButton().first().click().pause()
        homePage.renameMenuOption().click().pause()
        homePage.fileRenameInput().type("{selectall}{del}{esc}").pause()
        homePage.fileRenameInput().should("not.exist").pause()
        homePage.fileItemName().contains(newName).pause()
      })})
  })
})
