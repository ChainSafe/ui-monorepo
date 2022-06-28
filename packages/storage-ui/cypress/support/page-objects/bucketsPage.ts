// Only add things here that could be applicable to the bucket page

import { FILE_SYSTEM_TYPES } from "../utils/TestConstants"
import { basePage } from "./basePage"
import { createBucketModal } from "./modals/createBucketModal"

export const bucketsPage = {
  ...basePage,

  // main bucket browser elements
  bucketsHeaderLabel: () => cy.get("[data-cy=header-buckets]", { timeout: 20000 }),
  createBucketButton: () => cy.get("[data-cy=button-create-bucket]"),

  // bucket browser row elements
  bucketItemRow: () => cy.get("[data-cy=row-bucket-item]"),
  nameTableHeader: () => cy.get("[data-cy=table-header-name]"),
  fileSystemTableHeader: () => cy.get("[data-cy=table-header-file-system]"),
  sizeTableHeader: () => cy.get("[data-cy=table-header-size]"),
  bucketItemName: () => cy.get("[data-cy=cell-bucket-name]"),
  bucketFileSystemType: () => cy.get("[data-cy=cell-file-system-type]"),
  bucketRowKebabButton: () => cy.get("[data-testid=dropdown-title-bucket-kebab]"),

  // menu elements
  deleteBucketMenuOption: () => cy.get("[data-cy=menu-delete-bucket]"),

  // helpers and convenience functions
  createBucket(bucketName: string, bucketType: FILE_SYSTEM_TYPES) {
    this.createBucketButton().click()
    createBucketModal.body().should("be.visible")
    createBucketModal.bucketNameInput().type(bucketName)
    switch (bucketType) {
      case FILE_SYSTEM_TYPES.IPFS:
        createBucketModal.ipfsRadioInput().click()
        break
      case FILE_SYSTEM_TYPES.CHAINSAFE:
        createBucketModal.chainsafeRadioInput().click()
        break
    }
    createBucketModal.submitButton().click()
    createBucketModal.body().should("not.exist")
  }
}
