import React, { useState } from "react"
import { Link, Typography } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import InvoiceLines from "../../../Elements/InvoiceLines"
import PayInvoiceModal from "./PayInvoice/PayInvoiceModal"
import { useBilling } from "../../../../Contexts/BillingContext"
import { ROUTE_LINKS } from "../../../FilesRoutes"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    container: {
      padding: `${constants.generalUnit}px 0`,
      margin: `${constants.generalUnit * 1.5}px 0`
    },
    link: {
      textAlign: "right",
      fontSize: 16
    },
    spaceBetweenBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    billingText: {
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit * 2
    }
  })
)

const BillingHistory = () => {
  const classes = useStyles()
  const [invoiceToPay, setInvoiceToPay] = useState<string| undefined>()
  const { isPendingInvoice, openInvoice } = useBilling()

  return (
    <div className={classes.container}>
      <div className={classes.spaceBetweenBox}>
        <Typography
          variant="h4"
          component="h4"
          data-cy="header-billing-history"
        >
          <Trans>Billing history</Trans>
        </Typography>
        <Typography
          variant="body1"
          component="p"
          className={classes.link}
        >
          <Link to={ROUTE_LINKS.BillingHistory}>
            <Trans>All invoices</Trans>
          </Link>
        </Typography>
      </div >
      {(isPendingInvoice || openInvoice) &&
      <Typography>
        <Trans>Please complete payment of the following outstanding invoices in order to avoid account suspension</Trans>
      </Typography>}
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
