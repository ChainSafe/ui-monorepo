// Only add things here that could be applicable to the bucket page

import { basePage } from "./basePage"

export const cidsPage = {
  ...basePage,

  bucketsHeaderLabel: () => cy.get("[data-cy=buckets-header]", { timeout: 20000 })
}