import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"

export const sharedFolderContentsPage = {
  ...basePage,
  ...fileBrowser,

  // kebab menu elements
  previewMenuOption: () => cy.get("[data-cy=menu-preview]"),
  downloadMenuOption: () => cy.get("[data-cy=menu-download]"),
  infoMenuOption: () => cy.get("[data-cy=menu-info]"),
  reportMenuOption: () => cy.get("[data-cy=menu-report]"),
  copyToMenuOption: () => cy.get("[data-cy=menu-share]"),
  renameMenuOption: () => cy.get("[data-cy=menu-rename]"),
  moveMenuOption: () => cy.get("[data-cy=menu-move]"),
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]"),

  // helpers and convenience functions
  hasViewOnlyPermissionOptions(elementVisible: boolean) {
    let assertion: string

    if (elementVisible == true) {
      assertion = "be.visible"
    }
    else {
      assertion = "not.exist"
    }

    this.previewMenuOption().should(assertion)
    this.downloadMenuOption().should(assertion)
    this.infoMenuOption().should(assertion)
    this.reportMenuOption().should(assertion)
    this.copyToMenuOption().should(assertion)
  },

  hasCanEditPermissionOptions(elementVisible: boolean) {
    let assertion: string

    if (elementVisible == true) {
      assertion = "be.visible"
    }
    else {
      assertion = "not.exist"
    }

    this.renameMenuOption().should(assertion)
    this.moveMenuOption().should(assertion)
    this.deleteMenuOption().should(assertion)
  }
}