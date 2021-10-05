import { baseToast } from "./baseToast"

export const deleteSuccessToast = {
  ...baseToast,
  body: () => cy.get("[data-testId=toast-deletion-success]", { timeout: 10000 })
}
