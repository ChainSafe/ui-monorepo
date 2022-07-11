// Only add things here that could be applicable to the bucket page

import { basePage } from "./basePage"
import { createBucketModal } from "./modals/createBucketModal"

export const bucketsPage = {
  ...basePage,

  // main bucket browser elements
  bucketsHeaderLabel: () => cy.get("[data-cy=header-buckets]", { timeout: 20000 }),
  createBucketButton: () => cy.get("[data-cy=button-create-bucket]"),

  // bucket browser row elements
  bucketItemRow: () => cy.get("[data-cy=row-bucket-item]"),
  bucketsTableHeaderName: () => cy.get("[data-cy=buckets-table-header-name]"),
  bucketsTableHeaderFileSystem: () => cy.get("[data-cy=buckets-table-header-file-system]"),
  bucketsTableHeaderSize: () => cy.get("[data-cy=buckets-table-header-size]"),
  bucketItemName: () => cy.get("[data-cy=cell-bucket-name]"),
  bucketFileSystemType: () => cy.get("[data-cy=cell-file-system-type]"),
  bucketRowKebabButton: () => cy.get("[data-testid=dropdown-title-bucket-kebab]"),

  // menu elements
  deleteBucketMenuOption: () => cy.get("[data-cy=menu-delete-bucket]"),

  // helpers and convenience functions
  awaitBucketRefresh() {
    cy.intercept("GET", "**/buckets/summary").as("refresh")
    cy.wait("@refresh")
  },

  createBucket(bucketName: string, bucketType: "ipfs" | "chainsafe") {
    this.createBucketButton().click()
    createBucketModal.body().should("be.visible")
    createBucketModal.bucketNameInput().type(bucketName)
    if (bucketType == "ipfs") {
      createBucketModal.ipfsRadioInput().click()
    } else {
      createBucketModal.chainsafeRadioInput().click()
    }
    createBucketModal.submitButton().click()
    createBucketModal.body().should("not.exist")
    this.awaitBucketRefresh()
  }
}
