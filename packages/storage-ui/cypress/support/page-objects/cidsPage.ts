// Only add things here that could be applicable to the cids page

import { basePage } from "./basePage"
import { testCid } from "../../fixtures/storageTestData"
import { addCidModal } from "./modals/addCidModal"

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
  cidNameCell: () => cy.get("[data-cy=cell-pin-name]"),
  cidRowKebabButton: () => cy.get("[data-testid=dropdown-title-cid-kebab]"),

  // menu elements
  unpinMenuOption: () => cy.get("[data-cy=menu-unpin]"),

  // helpers and convenience functions
  addPinnedCid() {
    this.pinButton().click()
    addCidModal.cidInput().type(testCid)
    addCidModal.pinSubmitButton().click()
    this.cidItemRow().should("have.length", 1)
  }
}