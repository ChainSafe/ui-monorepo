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
  cidItemRow: () => cy.get("[data-cy=row-cid-item]", { timeout: 20000 }),
  cidRowKebabButton: () => cy.get("[data-testid=dropdown-title-cid-kebab]"),

  // pin cid modal elements
  pinCidForm: () => cy.get("[data-testid=form-create-bucket]"),
  cidInput: () => cy.get("[data-cy=input-cid]"),
  pinCancelButton: () => cy.get("[data-cy=button-cancel-add-pin]"),
  pinSubmitButton: () => cy.get("[data-cy=button-submit-pin]"),

  // menu elements
  unpinMenuOption: () => cy.get("[data-cy=menu-unpin]"),

  // helpers and convenience functions
  addPinnedCid() {
    this.pinButton().click()
    this.cidInput().type("QmUxmKgVh6XGP9s63U1q41LG9oXDkihZPKSAoQMbeEAEA8")
    this.pinSubmitButton().click()
    this.cidItemRow().should("have.length", 1)
  }
}