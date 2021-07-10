import { bucketsPage } from "../support/page-objects/bucketsPage"
import { navigationMenu } from "../support/page-objects/navigationMenu"

describe("Bucket management", () => {

  context("desktop", () => {

    it("can create a bucket", () => {
      cy.web3Login({ clearPins: true })

      // create a bucket and see it in the bucket table
      navigationMenu.bucketsNavButton().click()
      bucketsPage.createBucketButton().click()
      bucketsPage.bucketNameInput().type("Awesome Bucket")
      bucketsPage.createBucketSubmitButton().click()
      bucketsPage.bucketItemRow().should("have.length", 1)

      // open create bucket modal and cancel it
      bucketsPage.createBucketButton().click()
      bucketsPage.createBucketCancelButton().click()
      bucketsPage.createBucketForm().should("not.exist")
    })

    it("can delete a bucket", () => {
      cy.web3Login({ clearPins: true })

      // delete a bucket ensure it's row is removed
      navigationMenu.bucketsNavButton().click()
      bucketsPage.createBucket("Delete Me")
      bucketsPage.bucketRowKebabButton().first().click()
      bucketsPage.deleteBucketMenuOption().first().click()
      bucketsPage.bucketItemRow().should("not.exist")
    })
  })
})
