import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"

export const folderContentsPage = {
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
  deleteMenuOption: () => cy.get("[data-cy=menu-delete]")
}