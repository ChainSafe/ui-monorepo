import { bucketsPage } from "../support/page-objects/bucketsPage"
import { bucketName } from "../fixtures/storageTestData"

import { navigationMenu } from "../support/page-objects/navigationMenu"

describe("Bucket management", () => {

  context("desktop", () => {

    it("can create a bucket", () => {
      cy.web3Login({ clearPins: true, deleteFpsBuckets: true })

      // create a bucket and see it in the bucket table
      navigationMenu.bucketsNavButton().click()
      bucketsPage.createBucketButton().click()
      bucketsPage.bucketNameInput().type(bucketName)
      bucketsPage.createBucketSubmitButton().safeClick()
      bucketsPage.bucketItemRow().should("have.length", 1)
      bucketsPage.bucketItemName().should("have.text", bucketName)

      // open create bucket modal and cancel it
      bucketsPage.createBucketButton().click()
      bucketsPage.createBucketCancelButton().click()
      bucketsPage.createBucketForm().should("not.exist")
    })

    it("can delete a bucket", () => {
      cy.web3Login({ clearPins: true, deleteFpsBuckets: true })

      // delete a bucket and ensure its row is removed
      navigationMenu.bucketsNavButton().click()
      // creating a bucket with a unique name
      bucketsPage.createBucket(`${bucketName}_${Date.now()}`)
      bucketsPage.bucketRowKebabButton().first().click()
      bucketsPage.deleteBucketMenuOption().first().click()
      bucketsPage.bucketItemRow().should("not.exist")
      bucketsPage.bucketItemName().should("not.exist")
    })
  })
})
