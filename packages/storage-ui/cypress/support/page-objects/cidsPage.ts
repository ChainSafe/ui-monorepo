// Only add things here that could be applicable to the cids page

import { basePage } from "./basePage"
import { testCid, testCidName } from "../../fixtures/storageTestData"
import { addCidModal } from "./modals/addCidModal"

export const cidsPage = {
  ...basePage,

  // main cid browser elements
  cidsHeaderLabel: () => cy.get("[data-cy=cids-header]", { timeout: 20000 }),
  pinButton: () => cy.get("[data-cy=button-pin-cid]"),

  // cid browser row elements
  searchCidInput: () => cy.get("[data-testid=input-search-cid]"),
  cidsTableHeaderName: () => cy.get("[data-cy=cids-table-header-name]"),
  cidsTableHeaderCid: () => cy.get("[data-cy=cids-table-header-cid]"),
  cidsTableHeaderCreated: () => cy.get("[data-cy=cids-table-header-created]"),
  cidsTableHeaderSize: () => cy.get("[data-cy=cids-table-header-size]"),
  cidsTableHeaderStatus: () => cy.get("[data-cy=cids-table-header-status]"),
  cidItemRow: () => cy.get("[data-cy=row-cid-item]", { timeout: 20000 }),
  cidNameCell: () => cy.get("[data-cy=cell-pin-name]"),
  cidCell: () => cy.get("[data-cy=cell-pin-cid]"),
  cidRowKebabButton: () => cy.get("[data-testid=dropdown-title-cid-kebab]"),

  // menu elements
  unpinMenuOption: () => cy.get("[data-cy=menu-unpin]"),

  // helpers and convenience functions
  addPinnedCid(cidDetails?: {name?: string; cid?: string}) {
    const name = cidDetails?.name ? cidDetails.name : testCidName
    const cid = cidDetails?.cid ? cidDetails.cid : testCid

    this.pinButton().click()
    addCidModal.nameInput().type(name)
    addCidModal.cidInput().type(cid)
    addCidModal.pinSubmitButton().click()
    this.cidItemRow().should("have.length", 1)
  }
}