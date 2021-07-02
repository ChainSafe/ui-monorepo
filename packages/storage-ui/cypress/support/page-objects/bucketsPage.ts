// Only add things here that could be applicable to the bucket page

import { basePage } from "./basePage"

export const bucketsPage = {
  ...basePage,

  // main bucket browser elements
  bucketsHeaderLabel: () => cy.get("[data-cy=buckets-header]", { timeout: 20000 }),
  createBucketButton: () => cy.get("[data-cy=button-create-bucket]"),

  // bucket browser row elements
  nameTableHeader: () => cy.get("[data-cy=table-header-name]"),
  sizeTableHeader: () => cy.get("[data-cy=table-header-size]"),
  bucketRowKebabButton: () => cy.get("[data-testid=dropdown-title-bucket-kebab]"),

  // create bucket modal elements
  bucketNameInput: () => cy.get("[data-cy=input-bucket-name]"),
  createBucketCancelButton: () => cy.get("[data-cy=button-cancel-create]"),
  createBucketSubmitButton: () => cy.get("[data-cy=button-submit-create]"),

  // menu elements
  deleteBucketMenuOption: () => cy.get("[data-cy=menu-delete-bucket]")
}