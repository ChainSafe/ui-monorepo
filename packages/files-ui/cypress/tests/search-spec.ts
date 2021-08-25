import { homePage } from "../support/page-objects/homePage"
import { folderName } from "../fixtures/filesTestData"
import { searchPage } from "../support/page-objects/searchPage"
import { apiTestHelper } from "../support/utils/apiTestHelper"

describe("Search", () => {

  context("desktop", () => {

    it("can search for files and folders via name", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // add some folders and files
      apiTestHelper.createFolder(`/${folderName}A/${folderName}B`)
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")

      // search for a specific folder, ensure 1 result is found
      homePage.searchInput().type(`${folderName}A{enter}`)
      //searchPage.searchItemRow().should("have.length", 1)
      searchPage.fileItemName().should("contain.text", `${folderName}A`)

      cy.go("back")

      // perform a loose search, ensure 2 results are found
      homePage.searchInput().type(`{selectall}{del}${folderName}{enter}`)
      //searchPage.searchItemRow().should("have.length", 2)
      searchPage.fileItemName().should("contain.text", `${folderName}A`)
      searchPage.fileItemName().should("contain.text", `${folderName}B`)

      //cy.go("back")

      // search for a specific file, ensure 1  result is found
      // homePage.searchInput().type(`${folderName}1{enter}`)
      // searchPage.searchItemRow().should("have.length", 1)
      // searchPage.fileItemName().should("contain.text", `${folderName}1`)

    })

    it("can see no data state when no search results are found"), () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
    }

    it("can search for items that are in the bin"), () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
    }

    it("can view folder content by double clicking the folder in search result"), () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
    }

    it("can view file preview by double clicking the file in search result"), () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
    }

  })
})
