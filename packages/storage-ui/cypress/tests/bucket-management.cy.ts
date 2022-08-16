import { bucketsPage } from "../support/page-objects/bucketsPage"
import { bucketContentsPage } from "../support/page-objects/bucketContentsPage"
import { createBucketModal } from "../support/page-objects/modals/createBucketModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { fileUploadModal } from "../support/page-objects/modals/fileUploadModal"
import { deleteBucketModal } from "../support/page-objects/modals/deleteBucketModal"
import { uploadCompleteToast } from "../support/page-objects/toasts/uploadCompleteToast"
import { downloadCompleteToast } from "../support/page-objects/toasts/downloadCompleteToast"
import { deletionCompleteToast } from "../support/page-objects/toasts/deletionCompleteToast"

describe("Bucket management", () => {

  context("desktop", () => {

    it("can create, upload file and delete a chainsafe bucket", () => {
      const chainSafeBucketName = `cs bucket ${Date.now()}`

      cy.web3Login({ clearPins: true, deleteFpsBuckets: true })
      navigationMenu.bucketsNavButton().click()

      // open create bucket modal and cancel it
      bucketsPage.createBucketButton().click()
      createBucketModal.cancelButton().click()
      createBucketModal.body().should("not.exist")

      // go to create bucket modal
      bucketsPage.createBucketButton().click()
      createBucketModal.body().should("be.visible")

      // ensure can't create an empty bucket
      createBucketModal.submitButton().click()
      createBucketModal.bucketNameInput().should("have.class", "error")

      // ensure can't create a bucket with only spaces
      createBucketModal.bucketNameInput().type("  ")
      createBucketModal.submitButton().click()
      createBucketModal.bucketNameInput().should("have.class", "error")

      // create a bucket and see it in the bucket table
      createBucketModal.bucketNameInput().type(chainSafeBucketName)
      createBucketModal.bucketNameInput().should("not.have.class", "error")
      createBucketModal.chainsafeRadioInput().click()
      createBucketModal.submitButton().click()
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.bucketItemName().should("have.text", chainSafeBucketName)
      bucketsPage.bucketFileSystemType().should("have.text", "Chainsafe")

      // ensure can't create a bucket with the same name
      bucketsPage.createBucketButton().click()
      createBucketModal.bucketNameInput().type(chainSafeBucketName)
      createBucketModal.submitButton().click()
      createBucketModal.bucketNameInput().should("have.class", "error")
      createBucketModal.cancelButton().click()

      // open bucket and ensure header matches the expected value
      bucketsPage.bucketItemName().dblclick()
      bucketContentsPage.bucketHeaderLabel()
        .should("be.visible")
        .should("contain.text", chainSafeBucketName)

      // upload a file to the bucket
      bucketContentsPage.uploadButton().click()
      fileUploadModal.body().attachFile("../fixtures/uploadedFiles/logo.png")
      fileUploadModal.fileList().should("have.length", 1)
      fileUploadModal.uploadButton().safeClick()
      fileUploadModal.body().should("not.exist")
      bucketContentsPage.awaitBucketRefresh()
      uploadCompleteToast.body().should("be.visible")
      uploadCompleteToast.closeButton().click()
      bucketContentsPage.fileItemRow().should("have.length", 1)

      // delete chainsafe bucket
      navigationMenu.bucketsNavButton().click()
      bucketsPage.bucketRowKebabButton()
        .should("be.visible")
        .click()
      bucketsPage.deleteBucketMenuOption().click()
      deleteBucketModal.body().should("be.visible")
      deleteBucketModal.confirmButton().safeClick()
      deleteBucketModal.body().should("not.exist")
      bucketsPage.bucketItemRow().should("not.exist")
      bucketsPage.bucketItemName().should("not.exist")
    })

    // it("can create, upload file and delete an ipfs bucket", () => {
    //   const ipfsBucketName = `ipfs bucket ${Date.now()}`

    //   cy.web3Login({ clearPins: true, deleteFpsBuckets: true })
    //   navigationMenu.bucketsNavButton().click()

    //   // go to create bucket modal
    //   bucketsPage.createBucketButton().click()
    //   createBucketModal.body().should("be.visible")

    //   // ensure can't create an empty bucket
    //   createBucketModal.submitButton().click()
    //   createBucketModal.bucketNameInput().should("have.class", "error")

    //   // ensure can't create a bucket with only spaces
    //   createBucketModal.bucketNameInput().type("  ")
    //   createBucketModal.submitButton().click()
    //   createBucketModal.bucketNameInput().should("have.class", "error")

    //   // create a bucket and see it in the bucket table
    //   createBucketModal.bucketNameInput().type(ipfsBucketName)
    //   createBucketModal.ipfsRadioInput().click()
    //   createBucketModal.submitButton().click()
    //   bucketsPage.bucketItemRow().should("have.length", 1)
    //   bucketsPage.bucketItemName().should("have.text", ipfsBucketName)
    //   bucketsPage.bucketFileSystemType().should("have.text", "IPFS MFS")

    //   // ensure can't create a bucket with the same name
    //   bucketsPage.createBucketButton().click()
    //   createBucketModal.bucketNameInput().type(ipfsBucketName)
    //   createBucketModal.submitButton().click()
    //   createBucketModal.bucketNameInput().should("have.class", "error")
    //   createBucketModal.cancelButton().click()

    //   // open bucket and ensure header matches the expected value
    //   bucketsPage.bucketItemName().dblclick()
    //   bucketContentsPage.bucketHeaderLabel()
    //     .should("be.visible")
    //     .should("contain.text", ipfsBucketName)

    //   // upload a file to the bucket
    //   bucketContentsPage.uploadButton().click()
    //   fileUploadModal.body().attachFile("../fixtures/uploadedFiles/logo.png")
    //   fileUploadModal.fileList().should("have.length", 1)
    //   fileUploadModal.uploadButton().safeClick()
    //   fileUploadModal.body().should("not.exist")
    //   bucketContentsPage.awaitBucketRefresh()
    //   uploadCompleteToast.body().should("be.visible")
    //   uploadCompleteToast.closeButton().click()
    //   bucketContentsPage.fileItemRow().should("have.length", 1)

    //   // delete ipfs bucket
    //   navigationMenu.bucketsNavButton().click()
    //   bucketsPage.bucketRowKebabButton()
    //     .should("be.visible")
    //     .click()
    //   bucketsPage.deleteBucketMenuOption().click()
    //   deleteBucketModal.body().should("be.visible")
    //   deleteBucketModal.confirmButton().safeClick()
    //   deleteBucketModal.body().should("not.exist")
    //   bucketsPage.bucketItemRow().should("not.exist")
    //   bucketsPage.bucketItemName().should("not.exist")
    // })

    it("can sort by name or file system in buckets table", () => {
      const firstChainSafeBucketName = `first cs bucket ${Date.now()}`
      const secondChainsafeBucketName = `second ipfs bucket ${Date.now()}`

      cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets:
        [{ name: firstChainSafeBucketName, type: "chainsafe" }, { name: secondChainsafeBucketName, type: "chainsafe" }]
      })
      navigationMenu.bucketsNavButton().click()

      // by default should be sort by date uploading in ascending order (oldest first)
      bucketsPage.bucketItemName().eq(0).should("have.text", firstChainSafeBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", secondChainsafeBucketName)

      // ensure that sort by name in descending order (Z-A)
      bucketsPage.bucketsTableHeaderName().click()
      bucketsPage.bucketItemName().eq(0).should("have.text", secondChainsafeBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", firstChainSafeBucketName)

      // ensure that sort by name in ascending order (A-Z)
      bucketsPage.bucketsTableHeaderName().click()
      bucketsPage.bucketItemName().eq(0).should("have.text", firstChainSafeBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", secondChainsafeBucketName)

      // commented because we can't create ipfs buckets right now
      // ensure that sort by file system in descending order (Z-A)
      // bucketsPage.bucketsTableHeaderFileSystem().click()
      // bucketsPage.bucketItemName().eq(0).should("have.text", ipfsBucketName)
      // bucketsPage.bucketItemName().eq(1).should("have.text", chainSafeBucketName)

      // ensure that sort by file system in ascending order (A-Z)
      // bucketsPage.bucketsTableHeaderFileSystem().click()
      // bucketsPage.bucketItemName().eq(0).should("have.text", chainSafeBucketName)
      // bucketsPage.bucketItemName().eq(1).should("have.text", ipfsBucketName)
    })

    // it("can rename a folder inside the ipfs bucket", () => {
    //   const ipfsBucketName = `ipfs bucket ${Date.now()}`
    //   const folderName = `folder ${Date.now()}`
    //   const newFolderName = `new folder name ${Date.now()}`

    //   cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: ipfsBucketName, type: "ipfs" }] })
    //   navigationMenu.bucketsNavButton().click()

    //   // go inside the bucket
    //   bucketsPage.bucketItemRow().should("have.length", 1)
    //   bucketsPage.bucketItemName().dblclick()

    //   // create a folder inside the bucket
    //   bucketContentsPage.createNewFolder(folderName)

    //   // ensure an error is displayed if the edited name of the folder is blank
    //   bucketContentsPage.renameFileOrFolder("{selectall}{del}")
    //   bucketContentsPage.fileRenameErrorLabel().should("be.visible")

    //   // ensure the original name of the folder persists if the rename submission is blank
    //   bucketContentsPage.renameFileOrFolder("{selectall}{del}{esc}")
    //   bucketContentsPage.fileRenameInput().should("not.exist")
    //   bucketContentsPage.fileItemName().contains(folderName)

    //   // rename a folder
    //   bucketContentsPage.renameFileOrFolder(`{selectall}${newFolderName}{enter}`)
    //   bucketContentsPage.fileItemName().contains(newFolderName)

    //   // ensure that the name of the folder is reset when renaming is canceled
    //   bucketContentsPage.renameFileOrFolder("{selectall}{del}}abc{esc}")
    //   bucketContentsPage.fileRenameInput().should("not.exist")
    //   bucketContentsPage.fileItemKebabButton().click()
    //   bucketContentsPage.renameMenuOption().click()
    //   bucketContentsPage.fileRenameInput().should("have.value", newFolderName)
    // })

    it("can rename a folder inside the chainsafe bucket", () => {
      const chainsafeBucketName = `chainsafe bucket ${Date.now()}`
      const folderName = `folder ${Date.now()}`
      const newFolderName = `new folder name ${Date.now()}`

      cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: chainsafeBucketName, type: "chainsafe" }] })
      navigationMenu.bucketsNavButton().click()

      // go inside the bucket
      bucketsPage.bucketItemName().dblclick()

      // create a folder inside the bucket
      bucketContentsPage.createNewFolder(folderName)

      // ensure an error is displayed if the edited name of the folder is blank
      bucketContentsPage.renameFileOrFolder("{selectall}{del}")
      bucketContentsPage.fileRenameErrorLabel().should("be.visible")

      // ensure the original name of the folder persists if the rename submission is blank
      bucketContentsPage.renameFileOrFolder("{selectall}{del}{esc}")
      bucketContentsPage.fileRenameInput().should("not.exist")
      bucketContentsPage.fileItemName().contains(folderName)

      // rename a folder
      bucketContentsPage.renameFileOrFolder(`{selectall}${newFolderName}{enter}`)
      bucketContentsPage.fileItemName().contains(newFolderName)

      // ensure that the name of the folder is reset when renaming is canceled
      bucketContentsPage.renameFileOrFolder("{selectall}{del}abc{esc}")
      bucketContentsPage.fileRenameInput().should("not.exist")
      bucketContentsPage.fileItemKebabButton().click()
      bucketContentsPage.renameMenuOption().click()
      bucketContentsPage.fileRenameInput().should("have.value", newFolderName)
    })

    // it("can rename a file inside the ipfs bucket", () => {
    //   const ipfsBucketName = `ipfs bucket ${Date.now()}`
    //   const newFileName = `new file name ${Date.now()}`

    //   cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: ipfsBucketName, type: "ipfs" }] })
    //   navigationMenu.bucketsNavButton().click()

    //   // go inside the bucket
    //   bucketsPage.bucketItemRow().should("have.length", 1)
    //   bucketsPage.bucketItemName().dblclick()

    //   // upload a file
    //   bucketContentsPage.uploadFileToBucket("../fixtures/uploadedFiles/logo.png")

    //   // ensure an error is displayed if the edited name of the file is blank
    //   bucketContentsPage.renameFileOrFolder("{selectall}{del}")
    //   bucketContentsPage.fileRenameErrorLabel().should("be.visible")

    //   // ensure the original name of the file persists if the rename submission is blank
    //   bucketContentsPage.renameFileOrFolder("{selectall}{del}{esc}")
    //   bucketContentsPage.fileRenameInput().should("not.exist")
    //   bucketContentsPage.fileItemName().contains("logo.png")

    //   // rename the file
    //   bucketContentsPage.renameFileOrFolder(`{selectall}${newFileName}{enter}`)
    //   bucketContentsPage.fileItemName().contains(newFileName)

    //   // ensure that the name of the file is reset when renaming is canceled
    //   bucketContentsPage.renameFileOrFolder("{selectall}{del}abc{esc}")
    //   bucketContentsPage.fileRenameInput().should("not.exist")
    //   bucketContentsPage.fileItemKebabButton().click()
    //   bucketContentsPage.renameMenuOption().click()
    //   bucketContentsPage.fileRenameInput().should("have.value", newFileName)
    // })

    it("can rename a file inside the chainsafe bucket", () => {
      const chainsafeBucketName = `chainsafe bucket ${Date.now()}`
      const newFileName = `new file name ${Date.now()}`

      cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: chainsafeBucketName, type: "chainsafe" }] })
      navigationMenu.bucketsNavButton().click()

      // go inside the bucket
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.bucketItemName().dblclick()

      // upload a file
      bucketContentsPage.uploadFileToBucket("../fixtures/uploadedFiles/logo.png")

      // ensure an error is displayed if the edited name of the file is blank
      bucketContentsPage.renameFileOrFolder("{selectall}{del}")
      bucketContentsPage.fileRenameErrorLabel().should("be.visible")

      // ensure the original name of the file persists if the rename submission is blank
      bucketContentsPage.renameFileOrFolder("{selectall}{del}{esc}")
      bucketContentsPage.fileRenameInput().should("not.exist")
      bucketContentsPage.fileItemName().contains("logo.png")

      // rename the file
      bucketContentsPage.renameFileOrFolder(`{selectall}${newFileName}{enter}`)
      bucketContentsPage.fileItemName().contains(newFileName)

      // ensure that the name of the file is reset when renaming is canceled
      bucketContentsPage.renameFileOrFolder("{selectall}{del}abc{esc}")
      bucketContentsPage.fileRenameInput().should("not.exist")
      bucketContentsPage.fileItemKebabButton().click()
      bucketContentsPage.renameMenuOption().click()
      bucketContentsPage.fileRenameInput().should("have.value", newFileName)
    })

    it("can download a file from chainsafe bucket", () => {
      const chainsafeBucketName = `cs bucket ${Date.now()}`
      const fileName = "text-file.txt"
      const downloadsFolder = Cypress.config("downloadsFolder")
      const fileFixturePath = `uploadedFiles/${fileName}`

      cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: chainsafeBucketName, type: "chainsafe" }] })

      // upload a file and store file content
      navigationMenu.bucketsNavButton().click()
      bucketsPage.bucketItemName().dblclick()

      // upload a file to the bucket
      bucketContentsPage.uploadFileToBucket(`../fixtures/uploadedFiles/${fileName}`)
      cy.fixture(fileFixturePath).as("fileContent")

      // download file from kebab menu 
      bucketContentsPage.fileItemKebabButton().click()

      // intercept POST to ensure the request was successful
      cy.intercept("POST", "**/bucket/*/download")
        .as("downloadRequest")
        .then(() => {
          bucketContentsPage.downloadMenuOption().click()

          cy.wait("@downloadRequest").should((download) => {
            expect(download.response).to.have.property("statusCode", 200)
          })
        })

      // ensure the file was downloaded
      downloadCompleteToast.body().should("be.visible")
      downloadCompleteToast.closeButton().click()
      cy.get<string>("@fileContent").then((fileContent) => {
        cy.readFile(`${downloadsFolder}/${fileName}`)
          .should("exist")
          .should("eq", fileContent)
      })
    })

    // it("can download a file from ipfs bucket", () => {
    //   const ipfsBucketName = `ipfs bucket ${Date.now()}`
    //   const fileName = "text-file.txt"
    //   const downloadsFolder = Cypress.config("downloadsFolder")
    //   const fileFixturePath = `uploadedFiles/${fileName}`

    //   cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: ipfsBucketName, type: "ipfs" }] })

    //   // upload a file and store file content
    //   navigationMenu.bucketsNavButton().click()
    //   bucketsPage.bucketItemName().dblclick()

    //   // upload a file to the bucket
    //   bucketContentsPage.uploadFileToBucket(`../fixtures/uploadedFiles/${fileName}`)
    //   cy.fixture(fileFixturePath).as("fileContent")

    //   // download file from kebab menu 
    //   bucketContentsPage.fileItemKebabButton().click()

    //   // intercept POST to ensure the request was successful
    //   cy.intercept("POST", "**/bucket/*/download")
    //     .as("downloadRequest")
    //     .then(() => {
    //       bucketContentsPage.downloadMenuOption().click()

    //       cy.wait("@downloadRequest").should((download) => {
    //         expect(download.response).to.have.property("statusCode", 200)
    //       })
    //     })

    //   // ensure the file was downloaded
    //   downloadCompleteToast.body().should("be.visible")
    //   downloadCompleteToast.closeButton().click()
    //   cy.get<string>("@fileContent").then((fileContent) => {
    //     cy.readFile(`${downloadsFolder}/${fileName}`)
    //       .should("exist")
    //       .should("eq", fileContent)
    //   })
    // })

    // it("can copy to clipboard the cid inside the ipfs bucket", () => {
    //   const ipfsBucketName = `ipfs bucket ${Date.now()}`

    //   cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: ipfsBucketName, type: "ipfs" }] })
    //   // upload a file to the bucket
    //   navigationMenu.bucketsNavButton().click()
    //   bucketsPage.bucketItemName().dblclick()
    //   bucketContentsPage.uploadFileToBucket("../fixtures/uploadedFiles/text-file.txt")

    //   // ensure the correct cid is being copied to the clipboard
    //   bucketContentsPage.fileItemCid().click()
    //   cy.window().its("navigator.clipboard").invoke("readText").then((text) => {
    //     bucketContentsPage.fileItemCid().should("have.text", text)
    //   })
    // })

    it("can copy to clipboard the cid inside the chainsafe bucket", () => {
      const chainsafeBucketName = `chainsafe bucket ${Date.now()}`

      cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: chainsafeBucketName, type: "chainsafe" }] })
      // upload a file to the bucket
      navigationMenu.bucketsNavButton().click()
      bucketsPage.bucketItemName().dblclick()
      bucketContentsPage.uploadFileToBucket("../fixtures/uploadedFiles/text-file.txt")

      // ensure the correct cid is being copied to the clipboard
      bucketContentsPage.fileItemCid().click()
      cy.window().its("navigator.clipboard").invoke("readText").then((text) => {
        bucketContentsPage.fileItemCid().should("have.text", text)
      })
    })

    it("can delete a file inside the chainsafe bucket", () => {
      const chainsafeBucketName = `chainsafe bucket ${Date.now()}`

      cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: chainsafeBucketName, type: "chainsafe" }] })
      navigationMenu.bucketsNavButton().click()

      // go inside the bucket
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.bucketItemName().dblclick()

      // upload a file
      bucketContentsPage.uploadFileToBucket("../fixtures/uploadedFiles/logo.png")

      // delete the file
      bucketContentsPage.deleteFileOrFolder()
      deletionCompleteToast.body().should("be.visible")
      deletionCompleteToast.closeButton().click()
      bucketContentsPage.fileItemRow().should("have.length", 0)
    })

    it("can delete a folder inside the chainsafe bucket", () => {
      const chainsafeBucketName = `chainsafe bucket ${Date.now()}`
      const folderName = `folder ${Date.now()}`

      cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: chainsafeBucketName, type: "chainsafe" }] })
      navigationMenu.bucketsNavButton().click()

      // go inside the bucket
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.bucketItemName().dblclick()

      // create a folder inside the bucket
      bucketContentsPage.createNewFolder(folderName)

      // delete the folder
      bucketContentsPage.deleteFileOrFolder()
      deletionCompleteToast.body().should("be.visible")
      deletionCompleteToast.closeButton().click()
      bucketContentsPage.fileItemRow().should("have.length", 0)
    })

    // it("can delete a file inside the ipfs bucket", () => {
    //   const ipfsBucketName = `ipfs bucket ${Date.now()}`

    //   cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: ipfsBucketName, type: "ipfs" }] })
    //   navigationMenu.bucketsNavButton().click()

    //   // go inside the bucket
    //   bucketsPage.bucketItemRow().should("have.length", 1)
    //   bucketsPage.bucketItemName().dblclick()

    //   // upload a file
    //   bucketContentsPage.uploadFileToBucket("../fixtures/uploadedFiles/logo.png")

    //   // delete the file
    //   bucketContentsPage.deleteFileOrFolder()
    //   deletionCompleteToast.body().should("be.visible")
    //   deletionCompleteToast.closeButton().click()
    //   bucketContentsPage.fileItemRow().should("have.length", 0)
    // })

    // it("can delete a folder inside the ipfs bucket", () => {
    //   const ipfsBucketName = `ipfs bucket ${Date.now()}`
    //   const folderName = `folder ${Date.now()}`

    //   cy.web3Login({ deleteFpsBuckets: true, createFpsBuckets: [{ name: ipfsBucketName, type: "ipfs" }] })
    //   navigationMenu.bucketsNavButton().click()

    //   // go inside the bucket
    //   bucketsPage.bucketItemRow().should("have.length", 1)
    //   bucketsPage.bucketItemName().dblclick()

    //   // create a folder inside the bucket
    //   bucketContentsPage.createNewFolder(folderName)

    //   // delete the folder
    //   bucketContentsPage.deleteFileOrFolder()
    //   deletionCompleteToast.body().should("be.visible")
    //   deletionCompleteToast.closeButton().click()
    //   bucketContentsPage.fileItemRow().should("have.length", 0)
    // })
  })
})
