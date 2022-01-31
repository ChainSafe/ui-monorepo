import { basePage } from "./basePage"

export const billingHistoryPage = {
  ...basePage,
  billingHistoryHeader: () => cy.get("[data-cy=header-billing-history]"),
  downloadInvoiceButton: () => cy.get("[data-testid=button-download-invoice]"),
  payInvoiceButton: () => cy.get("[data-testid=button-pay-invoice]")
}