import { basePage } from "./basePage"

export const billingHistoryPage = {
  ...basePage,
  billingHistoryHeader: () => cy.get("[data-cy=header-billing-history]"),
  viewPdfButton: () => cy.get("[data-testid=button-download-invoice]"),
  payNowButton: () => cy.get("[data-testid=button-pay-invoice]")
}