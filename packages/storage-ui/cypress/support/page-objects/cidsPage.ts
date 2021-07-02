// Only add things here that could be applicable to the cids page

import { basePage } from "./basePage"

export const cidsPage = {
  ...basePage,

  // main cid browser elements
  cidsHeaderLabel: () => cy.get("[data-cy=cids-header]", { timeout: 20000 }),
  pinButton: () => cy.get("[data-cy=button-pin-cid]"),

  // cid browser row elements
  cidTableHeader: () => cy.get("[data-cy=table-header-cid]"),
  createdTableHeader: () => cy.get("[data-cy=table-header-created]"),
  sizeTableHeader: () => cy.get("[data-cy=table-header-size]"),
  statusTableHeader: () => cy.get("[data-cy=table-header-status]"),
  cidRowKebabButton: () => cy.get("[data-testid=dropdown-title-cid-kebab]"),

  // pin cid modal elements
  pinCidForm: () => cy.get("[data-testid=form-create-bucket]"),
  cidInput: () => cy.get("[data-cy=input-cid]"),
  pinCancelButton: () => cy.get("[data-cy=button-cancel-add-pin]"),
  pinSubmitButton: () => cy.get("[data-cy=button-submit-pin]"),

  // menu elements
  unpinMenuOption: () => cy.get("[data-cy=menu-unpin]")
}