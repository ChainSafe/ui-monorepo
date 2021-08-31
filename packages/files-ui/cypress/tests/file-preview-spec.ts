import { homePage } from "../support/page-objects/homePage"
import { previewModal } from "../support/page-objects/modals/previewModal"

describe("File Preview", () => {

  context("desktop", () => {

    it("can preview and browse compatible file types", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // add files
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")

      // store their file names as cypress aliases for later comparison
      homePage.fileItemName().eq(0).invoke("text").as("fileNameA")
      homePage.fileItemName().eq(1).invoke("text").as("fileNameB")

      // navigate to the preview modal for the first file
      homePage.fileItemKebabButton().eq(0).click()
      homePage.previewMenuOption().eq(0).click()
      previewModal.body().should("exist")

      // ensure the correct file is being previewed
      cy.get("@fileNameA").then(($fileNameA) => {
        previewModal.fileNameLabel().should("contain.text", $fileNameA)
      })

      // browse to the next file 
      previewModal.nextFileButton().click()
      cy.get("@fileNameB").then(($fileNameB) => {
        previewModal.fileNameLabel().should("contain.text", $fileNameB)
      })

      // return to the previous file
      previewModal.previousFileButton().click()
      cy.get("@fileNameA").then(($fileNameA) => {
        previewModal.fileNameLabel().should("contain.text", $fileNameA)
      })

      // close the preview modal to return to home page
      previewModal.closeButton().click()
      previewModal.body().should("not.exist")
      homePage.appHeaderLabel().should("exist")
    })
  })
})
