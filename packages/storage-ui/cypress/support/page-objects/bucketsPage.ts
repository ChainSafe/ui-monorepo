// Only add things here that could be applicable to the bucket page

import { basePage } from "./basePage"
import { createBucketModal } from "./modals/createBucketModal"

export const bucketsPage = {
  ...basePage,

  // main bucket browser elements
  bucketsHeaderLabel: () => cy.get("[data-cy=header-buckets]", { timeout: 20000 }),
  createBucketButton: () => cy.get("[data-cy=button-create-bucket]"),

  // bucket browser row elements
  bucketItemRow: () => cy.get("[data-cy=row-bucket-item]", { timeout: 20000 }),
  nameTableHeader: () => cy.get("[data-cy=table-header-name]"),
  sizeTableHeader: () => cy.get("[data-cy=table-header-size]"),
  bucketItemName: () => cy.get("[data-cy=cell-bucket-name]"),
  bucketFileSystemType: () => cy.get("[data-cy=cell-file-system-type]"),
  bucketRowKebabButton: () => cy.get("[data-testid=dropdown-title-bucket-kebab]", { timeout: 10000 }),

  // menu elements
  deleteBucketMenuOption: () => cy.get("[data-cy=menu-delete-bucket]"),

  // helpers and convenience functions
  createBucket(bucketName: string) {
    this.createBucketButton().click()
    createBucketModal.body().should("be.visible")
    createBucketModal.bucketNameInput().type(bucketName)
    createBucketModal.submitButton().safeClick()
    createBucketModal.body().should("not.exist")
  }
}
