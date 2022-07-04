import { bucketsPage } from "../support/page-objects/bucketsPage"
import { bucketContentsPage } from "../support/page-objects/bucketContentsPage"
import { createBucketModal } from "../support/page-objects/modals/createBucketModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"
import { fileUploadModal } from "../support/page-objects/modals/fileUploadModal"
import { deleteBucketModal } from "../support/page-objects/modals/deleteBucketModal"
import { uploadCompleteToast } from "../support/page-objects/toasts/uploadCompleteToast"
import { FILE_SYSTEM_TYPES } from "../support/utils/TestConstants"

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

      // create a bucket and see it in the bucket table
      bucketsPage.createBucketButton().click()
      createBucketModal.body().should("be.visible")
      createBucketModal.bucketNameInput().type(chainSafeBucketName)
      createBucketModal.chainsafeRadioInput().click()
      createBucketModal.submitButton().click()
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.bucketItemName().should("have.text", chainSafeBucketName)
      bucketsPage.bucketFileSystemType().should("have.text", "Chainsafe")

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

    it("can create, upload file and delete an ipfs bucket", () => {
      const ipfsBucketName = `ipfs bucket ${Date.now()}`
      cy.web3Login({ clearPins: true, deleteFpsBuckets: true })
      navigationMenu.bucketsNavButton().click()

      // create a bucket and see it in the bucket table
      bucketsPage.createBucketButton().click()
      createBucketModal.body().should("be.visible")
      createBucketModal.bucketNameInput().type(ipfsBucketName)
      createBucketModal.ipfsRadioInput().click()
      createBucketModal.submitButton().click()
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.bucketItemName().should("have.text", ipfsBucketName)
      bucketsPage.bucketFileSystemType().should("have.text", "IPFS MFS")

      // open bucket and ensure header matches the expected value
      bucketsPage.bucketItemName().dblclick()
      bucketContentsPage.bucketHeaderLabel()
        .should("be.visible")
        .should("contain.text", ipfsBucketName)

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

      // delete ipfs bucket
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

    it("can sort by name or file system in buckets table", () => {
      const chainSafeBucketName = `cs bucket ${Date.now()}`
      const ipfsBucketName = `ipfs bucket ${Date.now()}`

      cy.web3Login({ deleteFpsBuckets: true })
      navigationMenu.bucketsNavButton().click()

      bucketsPage.createBucket(chainSafeBucketName, FILE_SYSTEM_TYPES.CHAINSAFE)
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.createBucket(ipfsBucketName, FILE_SYSTEM_TYPES.IPFS)
      bucketsPage.bucketItemRow().should("have.length", 2)

      // by default should be sort by date uploading in ascending order (oldest first)
      bucketsPage.bucketItemName().eq(0).should("have.text", chainSafeBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", ipfsBucketName)

      // ensure that sort by name in descending order (Z-A)
      bucketsPage.bucketsTableHeaderName().click()
      bucketsPage.bucketItemName().eq(0).should("have.text", ipfsBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", chainSafeBucketName)

      // ensure that sort by name in ascending order (A-Z)
      bucketsPage.bucketsTableHeaderName().click()
      bucketsPage.bucketItemName().eq(0).should("have.text", chainSafeBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", ipfsBucketName)

      // ensure that sort by file system in descending order (Z-A)
      bucketsPage.bucketsTableHeaderFileSystem().click()
      bucketsPage.bucketItemName().eq(0).should("have.text", ipfsBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", chainSafeBucketName)

      // ensure that sort by file system in ascending order (A-Z)
      bucketsPage.bucketsTableHeaderFileSystem().click()
      bucketsPage.bucketItemName().eq(0).should("have.text", chainSafeBucketName)
      bucketsPage.bucketItemName().eq(1).should("have.text", ipfsBucketName)
    })
  })
})
