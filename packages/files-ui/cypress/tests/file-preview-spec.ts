import { homePage } from "../support/page-objects/homePage"
import { previewModal } from "../support/page-objects/modals/previewModal"

describe("File Preview", () => {

  context("desktop", () => {

    it("can preview and browse compatible file types", () => {
      cy.web3Login({ clearCSFBucket: true })

      // add files
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 2)

      // store their file names as cypress aliases for later comparison
      homePage.fileItemName().eq(0).invoke("text").as("fileNameA")
      homePage.fileItemName().eq(1).invoke("text").as("fileNameB")

      // navigate to the preview modal for the first file
      homePage.fileItemKebabButton().first().click()
      homePage.previewMenuOption().eq(0).click()
      previewModal.body().should("exist")

      // ensure the correct file is being previewed
      cy.get<string>("@fileNameA").then((fileNameA) => {
        previewModal.fileNameLabel().should("contain.text", fileNameA)
        previewModal.contentContainer().should("be.visible")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // browse to the next file 
      previewModal.nextFileButton().click()
      cy.get<string>("@fileNameB").then((fileNameB) => {
        previewModal.fileNameLabel().should("contain.text", fileNameB)
        previewModal.contentContainer().should("be.visible")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // return to the previous file
      previewModal.previousFileButton().click()
      cy.get<string>("@fileNameA").then((fileNameA) => {
        previewModal.fileNameLabel().should("contain.text", fileNameA)
        previewModal.contentContainer().should("be.visible")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // close the preview modal to return to the home page
      previewModal.closeButton().click()
      previewModal.body().should("not.exist")
      homePage.appHeaderLabel().should("exist")
    })

    it("can navigate through preview using keyboard hotkeys", () => {
      cy.web3Login({ clearCSFBucket: true })

      // add files
      homePage.uploadFile("../fixtures/uploadedFiles/chainsafe.png")
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 3)

      // store the 3 file names as cypress aliases for later comparison
      homePage.fileItemName().eq(0).invoke("text").as("fileNameA")
      homePage.fileItemName().eq(1).invoke("text").as("fileNameB")
      homePage.fileItemName().eq(2).invoke("text").as("fileNameC")

      // navigate to the preview modal for the first file
      homePage.fileItemKebabButton().first().click()
      homePage.previewMenuOption().eq(0).click()
      previewModal.body().should("exist")

      // ensure the correct file is being previewed
      cy.get<string>("@fileNameA").then((fileNameA) => {
        previewModal.fileNameLabel().should("contain.text", fileNameA)
        previewModal.contentContainer()
          .should("be.visible")
          .should("not.have.text", "Loading preview")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // browse to the 2nd file via the right arrow key
      cy.get("body").type("{rightarrow}")
      cy.get<string>("@fileNameB").then((fileNameB) => {
        previewModal.fileNameLabel().should("contain.text", fileNameB)
        previewModal.contentContainer()
          .should("be.visible")
          .should("not.have.text", "Loading preview")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // browse to the 3rd file via the right arrow key
      cy.get("body").type("{rightarrow}")
      cy.get<string>("@fileNameC").then((fileNameC) => {
        previewModal.fileNameLabel().should("contain.text", fileNameC)
        previewModal.contentContainer()
          .should("be.visible")
          .should("not.have.text", "Loading preview")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // return to the 2nd file via the left arrow key
      cy.get("body").type("{leftarrow}")
      cy.get<string>("@fileNameB").then((fileNameB) => {
        previewModal.fileNameLabel().should("contain.text", fileNameB)
        previewModal.contentContainer()
          .should("be.visible")
          .should("not.have.text", "Loading preview")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // return to the 1st file via the left arrow key
      cy.get("body").type("{leftarrow}")
      cy.get<string>("@fileNameA").then((fileNameA) => {
        previewModal.fileNameLabel().should("contain.text", fileNameA)
        previewModal.contentContainer()
          .should("be.visible")
          .should("not.have.text", "Loading preview")
        previewModal.unsupportedFileLabel().should("not.exist")
      })

      // exit preview via the escape key
      cy.get("body").type("{esc}")
      previewModal.body().should("not.exist")
      homePage.appHeaderLabel().should("exist")
    })

    it("can see option to download file from the preview screen", () => {
      cy.web3Login({ clearCSFBucket: true })
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileItemName().first().invoke("text").as("fileNameA")
      homePage.fileItemKebabButton().click()
      homePage.previewMenuOption().click()
      previewModal.body().should("exist")
      previewModal.downloadFileButton().should("be.visible")
    })

    it("can see unsupported file info and download option", () => {
      cy.web3Login({ clearCSFBucket: true })

      // add an unsupported file
      homePage.uploadFile("../fixtures/uploadedFiles/file.zip")

      // setup an api intercepter for download requests
      cy.intercept("POST", "**/bucket/*/download").as("downloadRequest").then(() => {
        homePage.fileItemName().dblclick()
        previewModal.unsupportedFileLabel().should("exist")
        previewModal.downloadUnsupportedFileButton().should("be.visible")
        // ensure that the file download does not start until the download button is clicked
        cy.get("@downloadRequest").then(($request) => {
          // retrieving the alias (spy) should yield null because posts should not have been made yet
          expect($request).to.be.null
        })

        // begin the file download 
        previewModal.downloadUnsupportedFileButton().click()

        // ensure the download request contains the correct file
        cy.wait("@downloadRequest").its("request.body").should("contain", {
          path: "/file.zip"
        })
      })

      // return to home, ensure the preview menu option is not shown for an unsupported file
      previewModal.closeButton().click()
      homePage.fileItemKebabButton().click()
      homePage.previewMenuOption().should("not.exist")
    })
  })
})
