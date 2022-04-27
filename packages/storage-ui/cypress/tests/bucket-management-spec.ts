import { bucketsPage } from "../support/page-objects/bucketsPage"
import { chainSafeBucketName, ipfsBucketName } from "../fixtures/storageTestData"
import { createBucketModal } from "../support/page-objects/modals/createBucketModal"
import { navigationMenu } from "../support/page-objects/navigationMenu"

describe("Bucket management", () => {

  context("desktop", () => {

    it("can create and delete a chainsafe bucket", () => {
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

      // delete chainsafe bucket
      bucketsPage.bucketRowKebabButton().first().click()
      bucketsPage.deleteBucketMenuOption().first().click()
      bucketsPage.bucketItemRow().should("not.exist")
      bucketsPage.bucketItemName().should("not.exist")
    })

    it("can create and delete an ipfs bucket", () => {
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

      // delete ipfs bucket
      bucketsPage.bucketRowKebabButton().first().click()
      bucketsPage.deleteBucketMenuOption().first().click()
      bucketsPage.bucketItemRow().should("not.exist")
      bucketsPage.bucketItemName().should("not.exist")
    })
  })
})
