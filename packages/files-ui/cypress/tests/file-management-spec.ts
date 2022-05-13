import { binPage } from "../support/page-objects/binPage"
import { homePage } from "../support/page-objects/homePage"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { folderName, folderPath } from "../fixtures/filesTestData"
import "cypress-pipe"
import { apiTestHelper } from "../support/utils/apiTestHelper"
import { createFolderModal } from "../support/page-objects/modals/createFolderModal"
import { deleteFileModal } from "../support/page-objects/modals/deleteFileModal"
import { fileUploadModal } from "../support/page-objects/modals/fileUploadModal"
import { moveItemModal } from "../support/page-objects/modals/moveItemModal"
import { recoverItemModal } from "../support/page-objects/modals/recoverItemModal"
import { deleteSuccessToast } from "../support/page-objects/toasts/deleteSuccessToast"
import { moveSuccessToast } from "../support/page-objects/toasts/moveSuccessToast"
import { recoverSuccessToast } from "../support/page-objects/toasts/recoverSuccessToast"
import { uploadCompleteToast } from "../support/page-objects/toasts/uploadCompleteToast"
import { fileInfoModal } from "../support/page-objects/modals/fileInfoModal"

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

      // attach a file and see it in the file list
      homePage.uploadButton().click()
      fileUploadModal.body().attachFile("../fixtures/uploadedFiles/text-file.txt")
      fileUploadModal.fileList().should("have.length", 1)

      // cancel and ensure that the upload modal is dismissed
      fileUploadModal.cancelButton().click()
      fileUploadModal.body().should("not.exist")
    })

    it("cannot upload a file if the size exceeds capacity", () => {
      // intercept and stub storage data
      cy.intercept("GET", "**/buckets/summary", (req) => {
        req.on("response", (res) => {
          res.body.available_storage = "0"
          res.body.total_storage = "107374182400"
          res.body.used_storage = "107374181400"
        })
      })

      cy.web3Login()
      homePage.uploadButton().click()
      fileUploadModal.attachFileForAutomation()
      // ensure an error label is present
      fileUploadModal.errorLabel().should("be.visible")
      fileUploadModal.uploadButton().should("be.disabled")
    })

    it("can move a file in and out of a folder", () => {
      cy.web3Login({ clearCSFBucket: true })

      // upload a file and save its name as a cypress alias
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 1)
      homePage.fileItemName().invoke("text").as("fileName")

      // create a folder 
      apiTestHelper.createFolder(folderPath)

      cy.get<string>("@fileName").then((fileName) => {
        // select the file and move it to the folder
        homePage.fileItemName().contains(fileName)
          .should("be.visible")
          .click()
        homePage.moveSelectedButton().click()
        moveItemModal.folderList().contains(folderName).click()
        moveItemModal.moveButton().safeClick()
        homePage.awaitBucketRefresh()
        moveSuccessToast.body().should("be.visible")
        moveSuccessToast.closeButton().click()

        // ensure there is only the folder in the Home directory 
        homePage.fileItemRow().should("have.length", 1)
        homePage.fileItemName().should("contain.text", folderName)

        // open the folder and confirm the file was moved inside
        homePage.fileItemName().contains(folderName)
          .should("be.visible")
          .dblclick()
        homePage.fileItemRow().should("have.length", 1)
        homePage.fileItemName().should("contain.text", fileName)

        // move the file back to the home root
        homePage.fileItemName().contains(fileName)
          .should("be.visible")
          .click()
        homePage.moveSelectedButton().click()
        moveItemModal.folderList().contains("Home").click()
        moveItemModal.moveButton().safeClick()
        homePage.awaitBucketRefresh()
        moveSuccessToast.body().should("be.visible")
        moveSuccessToast.closeButton().click()

        // ensure the home root now has the folder and file
        navigationMenu.homeNavButton().click()
        homePage.fileItemRow()
          .should("be.visible")
          .should("have.length", 2)
        homePage.fileItemName().should("contain.text", folderName)
        homePage.fileItemName().should("contain.text", fileName)

        // ensure file already in the root cannot be moved to Home
        homePage.fileItemName().contains(fileName)
          .should("be.visible")
          .click()
        homePage.moveSelectedButton().click()
        moveItemModal.folderList().contains("Home").click()
        moveItemModal.errorLabel().should("be.visible")
        moveItemModal.moveButton().should("be.disabled")
        moveItemModal.cancelButton().should("be.enabled")
      })
    })

    it("can see errors when attempting illogical folder move", () => {
      cy.web3Login({ clearCSFBucket: true })

      // create the necessary folder structure
      apiTestHelper.createFolder("/Parent/Child")

      // select a parent folder and initiate move action
      homePage.fileItemName().contains("Parent").click()
      homePage.moveSelectedButton().click()
      moveItemModal.body().should("be.visible")

      // ensure folder already in the root cannot be moved to Home
      moveItemModal.folderList().should("be.visible")
      moveItemModal.folderList().contains("Home").click()
      moveItemModal.body().should("be.visible")
      moveItemModal.errorLabel().should("be.visible")
      moveItemModal.moveButton().should("be.disabled")
      moveItemModal.cancelButton().should("be.enabled")

      // ensure a parent folder cannot be moved to itself
      moveItemModal.folderList().contains("Home").click()
      moveItemModal.folderList().contains("Parent").click()
      moveItemModal.body().should("be.visible")
      moveItemModal.errorLabel().should("be.visible")
      moveItemModal.moveButton().should("be.disabled")
      moveItemModal.cancelButton().should("be.enabled")

      // ensure a parent folder cannot be moved to a child folder
      moveItemModal.folderList().contains("Child").click()
      moveItemModal.body().should("be.visible")
      moveItemModal.errorLabel().should("be.visible")
      moveItemModal.moveButton().should("be.disabled")
      moveItemModal.cancelButton().should("be.enabled")

      // return home
      moveItemModal.cancelButton().click()
      moveItemModal.body().should("not.exist")

      // navigate to the child folder and initiate move action
      homePage.fileItemName().contains("Parent").dblclick()
      homePage.fileItemName().contains("Child").click()
      homePage.moveSelectedButton().click()

      // ensure a child folder cannot be moved to the parent folder it is already in
      moveItemModal.folderList().contains("Parent").click()
      moveItemModal.body().should("be.visible")
      moveItemModal.errorLabel().should("be.visible")
      moveItemModal.moveButton().should("be.disabled")
      moveItemModal.cancelButton().should("be.enabled")

      // ensure a child folder cannot be moved to itself
      moveItemModal.folderList().contains("Child").click()
      moveItemModal.body().should("be.visible")
      moveItemModal.errorLabel().should("be.visible")
      moveItemModal.moveButton().should("be.disabled")
      moveItemModal.cancelButton().should("be.enabled")
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
      uploadCompleteToast.body().should("be.visible")
      uploadCompleteToast.closeButton().click()
      homePage.fileItemRow().should("have.length", 2)
    })

    it("can rename a file with error handling", () => {
      const newName = "awesome new name that is pretty long and it shouldn't matter that much anyway"

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
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
      homePage.fileItemRow().should("not.exist")

      // confirm the deleted file is moved to the bin
      navigationMenu.binNavButton().click()
      homePage.fileItemRow().should("have.length", 1)

      // retrieve the deleted file's name, store as a cypress alias
      binPage.fileItemName().invoke("text").as("binFile")

      // ensure file in bin matches the name of the deleted file
      cy.get<string>("@originalFile").then((originalFile) => {
        cy.get("@binFile").should("equals", originalFile)
      })

      // recover the file via the menu option
      binPage.fileItemKebabButton().first().click()
      binPage.recoverMenuOption().click()
      recoverItemModal.folderList().should("exist")
      recoverItemModal.folderList().contains("Home").click()
      recoverItemModal.recoverButton().safeClick()
      binPage.fileItemRow().should("not.exist")
      recoverSuccessToast.body().should("be.visible")
      recoverSuccessToast.closeButton().click()

      // ensure recovered file is correct
      navigationMenu.homeNavButton().click()
      // retrieve the recovered file's name, store as a cypress alias
      homePage.fileItemName().invoke("text").as("recoveredFile")

      binPage.fileItemRow().should("have.length", 1)

      // ensure file moved from the bin matches the name of the recovered file
      cy.get<string>("@recoveredFile").then((recoveredFile) => {
        cy.get("@binFile").should("equals", recoveredFile)
      })

      // permanently delete the file
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
      navigationMenu.binNavButton().click()
      binPage.fileItemKebabButton().first().click()
      binPage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
      binPage.fileItemRow().should("not.exist")
      navigationMenu.homeNavButton().click()
      homePage.fileItemRow().should("not.exist")
    })

    it("can delete, recover and permanently delete a folder", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // create a folder
      apiTestHelper.createFolder(folderPath)

      // delete the folder via the menu option 
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      deleteFileModal.body().should("be.visible")
      deleteFileModal.confirmButton().safeClick()
      deleteFileModal.body().should("not.exist")
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
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
      recoverItemModal.recoverButton().safeClick()
      binPage.fileItemRow().should("not.exist")

      // ensure recovered folder is correct
      navigationMenu.homeNavButton().click()
      binPage.fileItemRow().should("have.length", 1)
      homePage.fileItemName().should("have.text", folderName)

      // permanently delete the folder
      homePage.fileItemKebabButton().first().click()
      homePage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
      navigationMenu.binNavButton().click()
      binPage.fileItemKebabButton().first().click()
      binPage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
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
    })

    it("can see storage space summary updated accordingly", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // Make sure elements exist and that we are starting with 0
      navigationMenu.spaceUsedProgressBar().should("be.visible")
      navigationMenu.spaceUsedLabel().should("contain.text", "0 Bytes")

      // upload a file and ensure the storage space label adjusts
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      navigationMenu.spaceUsedProgressBar().should("be.visible")
      navigationMenu.spaceUsedLabel().should("not.contain.text", "0 Bytes")

      // delete the file from the bin and ensure the storage space label adjusts
      homePage.fileItemKebabButton().click()
      homePage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()

      navigationMenu.binNavButton().click()
      binPage.fileItemKebabButton().click()
      binPage.deleteMenuOption().click()
      deleteFileModal.confirmButton().safeClick()
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
      navigationMenu.spaceUsedProgressBar().should("be.visible")
      navigationMenu.spaceUsedLabel().should("contain.text", "0 Bytes")
    })

    it("can delete and recover multiple files", () => {
      cy.web3Login({ clearCSFBucket: true, clearTrashBucket: true })

      // upload 2 files
      homePage.uploadFile("../fixtures/uploadedFiles/logo.png")
      homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
      homePage.fileItemRow().should("have.length", 2)

      // store their file names as cypress aliases for later comparison
      homePage.fileItemName().eq(0).invoke("text").as("fileNameA")
      homePage.fileItemName().eq(1).invoke("text").as("fileNameB")

      // delete both of the files in the same action
      homePage.selectAllCheckbox().click()
      homePage.deleteSelectedButton().click()
      deleteFileModal.confirmButton().safeClick()
      deleteSuccessToast.body().should("be.visible")
      deleteSuccessToast.closeButton().click()
      homePage.fileItemRow().should("have.length", 0)

      // recover both of the files in the same action
      navigationMenu.binNavButton().click()
      binPage.selectAllCheckbox().click()
      binPage.recoverSelectedButton().click()
      recoverItemModal.folderList().should("exist")
      recoverItemModal.folderList().contains("Home").click()
      recoverItemModal.recoverButton().safeClick()
      binPage.fileItemRow().should("not.exist")

      // return home and ensure both of the files were recovered
      navigationMenu.homeNavButton().click()

      cy.get<string>("@fileNameA").then((fileNameA) => {
        homePage.fileItemName().should("contain.text", fileNameA)
      })

      cy.get<string>("@fileNameB").then((fileNameB) => {
        homePage.fileItemName().should("contain.text", fileNameB)
      })
    })

      it("can view file information via modal option", () => {
        cy.web3Login({ clearCSFBucket: true })
  
        // upload a file
        homePage.uploadFile("../fixtures/uploadedFiles/text-file.txt")
        homePage.fileItemRow().should("have.length", 1)
  
        // store file name as cypress aliases for later comparison
        homePage.fileItemName().eq(0).invoke("text").as("fileNameA")
  
        // navigate to the info modal for the file
        homePage.fileItemKebabButton().first().click()
        homePage.infoMenuOption().eq(0).click()
  
        // ensure all labels on the modal are visible
        fileInfoModal.nameLabel().should("be.visible")
        fileInfoModal.fileSizeLabel().should("be.visible")
        fileInfoModal.dateUploadedLabel().should("be.visible")
        fileInfoModal.cidLabel().should("be.visible")
        fileInfoModal.decryptionKeyLabel().should("be.visible")
  
        // ensure the correct file name is being displayed
        fileInfoModal.body().should("be.visible")
        cy.get<string>("@fileNameA").then((fileNameA) => {
          fileInfoModal.nameLabel().should("have.text", fileNameA)
        })
  
        // grant clipboard read permissions to the browser
        cy.wrap(Cypress.automation('remote:debugger:protocol', {
          command: 'Browser.grantPermissions',
          params: {
            permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
            origin: window.location.origin,
          },
        }))
        
        // ensure the correct CID is being copied to the clipboard
        fileInfoModal.cidLabel().click()
        cy.window().its('navigator.clipboard').invoke('readText').then((text) => {
          fileInfoModal.cidLabel().should("have.text", text)
        })

        // cancel and ensure that the modal is dismissed
        fileInfoModal.closeButton().click()
        fileInfoModal.body().should("not.exist")
      })
      
    })
    
})
