import { bucketsPage } from "../support/page-objects/bucketsPage"
import { bucketName } from "../fixtures/storageTestData"

import { navigationMenu } from "../support/page-objects/navigationMenu"

describe("Bucket management", () => {

  context("desktop", () => {

    it("can create a bucket", () => {
      cy.web3Login({ clearPins: true })

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

    it.skip("can delete a bucket", () => {
      cy.web3Login({ clearPins: true })

      // delete a bucket and ensure it's row is removed
      navigationMenu.bucketsNavButton().click().pause()
      bucketsPage.createBucket(bucketName)
      bucketsPage.bucketRowKebabButton().first().click()
      bucketsPage.deleteBucketMenuOption().first().click()
      bucketsPage.bucketItemRow().should("not.be.visible")
      bucketsPage.bucketItemName().should("not.be.visible")
    })
  })
})
