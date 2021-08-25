import { basePage } from "./basePage"

export const searchPage = {
  ...basePage,
  searchItemRow: () => cy.get("[data-cy=search-item-row]", { timeout: 20000 }),
  fileItemName: () => cy.get("[data-cy=file-item-name]")
}
