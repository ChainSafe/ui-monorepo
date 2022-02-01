import React, { useState } from "react"
import { Typography, Link } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import InvoiceLines from "../../../Elements/InvoiceLines"
import PayInvoiceModal from "./PayInvoice/PayInvoiceModal"
import { useBilling } from "../../../../Contexts/BillingContext"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    container: {
      padding: constants.generalUnit,
      margin: `${constants.generalUnit * 1.5}px 0`
    },
    link: {
      textAlign: "right",
      marginBottom: constants.generalUnit
    }
  })
)

const BillingHistory = () => {
  const classes = useStyles()
  const [invoiceToPay, setInvoiceToPay] = useState<string| undefined>()
  const { isPendingInvoice, invoices } = useBilling()

  return (
    <div className={classes.container}>
      <Typography
        variant="h4"
        component="h4"
        data-cy="header-billing-history"
      >
        <Trans>Billing history</Trans>
      </Typography>
      {(isPendingInvoice || invoices?.find(i => i.status === "open")) &&
      <Typography>
        <Trans>Please complete payment of the following outstanding invoices in order to avoid account suspension</Trans>
      </Typography>}
      <Typography
        variant="body1"
        component="p"
        className={classes.link}
      >
        <Link to={ROUTE_LINKS.BillingHistory}>
          <Trans>All invoices</Trans>
        </Link>
      </Typography>
      <InvoiceLines
        lineNumber={3}
        payInvoice={(invoiceId) => setInvoiceToPay(invoiceId)}
      />
      {invoiceToPay && <PayInvoiceModal
        invoiceId={invoiceToPay}
        onClose={() => setInvoiceToPay(undefined)}
      />}
    </div>
  )
}

export default BillingHistory
