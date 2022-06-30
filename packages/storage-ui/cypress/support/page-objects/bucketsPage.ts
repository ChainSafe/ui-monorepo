// Only add things here that could be applicable to the bucket page

import { basePage } from "./basePage"
import { createBucketModal } from "./modals/createBucketModal"

type BucketType = "ipfs" | "chainsafe"

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
  createBucket(bucketName: string, bucketType: BucketType) {
    this.createBucketButton().click()
    createBucketModal.body().should("be.visible")
    createBucketModal.bucketNameInput().type(bucketName)
    switch (bucketType) {
      case "ipfs":
        createBucketModal.ipfsRadioInput().click()
        break
      case "chainsafe":
        createBucketModal.chainsafeRadioInput().click()
        break
    }
    createBucketModal.submitButton().click()
    createBucketModal.body().should("not.exist")
  }
}
