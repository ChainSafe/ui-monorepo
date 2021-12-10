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
  viewOnlyPermissionOptionsShould(elementVisible: "be.visible" | "not.exist") {
    this.previewMenuOption().should(elementVisible)
    this.downloadMenuOption().should(elementVisible)
    this.infoMenuOption().should(elementVisible)
    this.reportMenuOption().should(elementVisible)
    this.copyToMenuOption().should(elementVisible)
  },

  canEditPermissionOptionsShould(elementVisible: "be.visible" | "not.exist") {
    this.renameMenuOption().should(elementVisible)
    this.moveMenuOption().should(elementVisible)
    this.deleteMenuOption().should(elementVisible)
  }
}