import { homePage } from "../support/page-objects/homePage"
import { folderName, folderPath } from "../fixtures/filesTestData"
import { searchPage } from "../support/page-objects/searchPage"
import { apiTestHelper } from "../support/utils/apiTestHelper"

describe("Search", () => {

  const folderA = `${folderName}A`
  const folderB = `${folderName}B`

  context("desktop", () => {

    it("can search for files and folders via name", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // add file and folders
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.fileItemName().invoke("text").as("fileName")
      apiTestHelper.createFolder("/" + folderA)
      apiTestHelper.createFolder("/" + folderB)

      // search for a specific folder, ensure 1 result is found
      homePage.searchInput().type(`${folderA}{enter}`)
      searchPage.fileItemRow()
        .should("be.visible")
        .should("have.length", 1)
      searchPage.fileItemName().should("contain.text", folderA)
      cy.go("back")

      // perform a loose search for folders, ensure that 2 results are found
      homePage.searchInput().type(`{selectall}{del}${folderName}{enter}`)
      searchPage.fileItemRow()
        .should("be.visible")
        .should("have.length", 2)
      searchPage.fileItemName().should("contain.text", folderA)
      searchPage.fileItemName().should("contain.text", folderB)
      cy.go("back")

      // search for a specific file, ensure only 1 result is found
      cy.get("@fileName").then(($fileName) => {
        homePage.searchInput().type(`{selectall}{del}${$fileName}{enter}`)
        searchPage.fileItemRow()
          .should("be.visible")
          .should("have.length", 1)
        searchPage.fileItemName().should("contain.text", $fileName)
      })
    })

    it("can see no data state when no search results are found", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
      homePage.searchInput().type(`{selectall}{del}${folderName}{enter}`)
      searchPage.appHeaderLabel().should("have.text", "Search results")
      searchPage.noDataStateInfo()
        .should("be.visible")
        .should("exist")
    })

    it("can view folder content from search result", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })
      apiTestHelper.createFolder(folderPath)
      homePage.searchInput().type(`${folderName}{enter}`)

      // view contents via menu option
      searchPage.fileItemKebabButton().click()
      searchPage.viewFolderMenuOption().click()
      searchPage.folderBreadcrumb().should("have.text", folderName)
      cy.go("back")

      // view contents via double click
      searchPage.fileItemRow().contains(folderName).dblclick()
      searchPage.folderBreadcrumb().should("have.text", folderName)
    })
  })
})
