import { basePage } from "./basePage"
import { fileBrowser } from "./fileBrowser"

export const searchPage = {
  ...basePage,
  ...fileBrowser,

  // kebab menu elements
  viewFolderMenuOption: () => cy.get("[data-cy=menu-view-folder]")
}
