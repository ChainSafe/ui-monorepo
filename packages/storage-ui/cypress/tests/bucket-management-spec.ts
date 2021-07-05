import { bucketsPage } from "../support/page-objects/bucketsPage"
import { navigationMenu } from "../support/page-objects/navigationMenu"

describe("Bucket management", () => {

  context("desktop", () => {

    it("can add files and cancel", () => {
      cy.web3Login({ clearPins: true })

      // create a bucket and see it in the bucket list
      navigationMenu.bucketsNavButton().click()
      bucketsPage.createBucketButton().click()
      bucketsPage.bucketNameInput().type("Awesome Bucket")
      bucketsPage.createBucketSubmitButton().click()
      bucketsPage.bucketItemRow().should("have.length", 1)
    })
  })
})
