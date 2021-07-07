// Only add things here that could be applicable to the cids page

import { basePage } from "./basePage"

export const cidsPage = {
  ...basePage,

  cidsHeaderLabel: () => cy.get("[data-cy=cids-header]", { timeout: 20000 })
}