import { baseToast } from "./baseToast"

export const moveSuccessToast = {
  ...baseToast,
  body: () => cy.get("[data-testId=toast-move-success]", { timeout: 10000 })
}
