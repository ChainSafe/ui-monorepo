import { baseToast } from "./baseToast"

export const uploadCompleteToast = {
  ...baseToast,
  body: () => cy.get("[data-testId=toast-upload-complete]", { timeout: 10000 })
}
