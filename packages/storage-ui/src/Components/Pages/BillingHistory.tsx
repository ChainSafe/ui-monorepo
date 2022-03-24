import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSSTheme } from "../../Themes/types"
import { Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import InvoiceLines from "../Elements/InvoiceLines"
import PayInvoiceModal from "../Modules/SubscriptionTab/PayInvoice/PayInvoiceModal"
import { usePageTrack } from "../../Contexts/PosthogContext"
import { Helmet } from "react-helmet-async"

const useStyles = makeStyles(
  ({ constants, breakpoints }: CSSTheme) =>
    createStyles({
      heading: {
        marginBottom: constants.generalUnit * 4,
        [breakpoints.down("md")]: {
          marginBottom: constants.generalUnit * 2
        }
      },
      loader: {
        marginTop: constants.generalUnit
      },
      centered: {
        textAlign: "center"
      },
      root: {
        [breakpoints.down("md")]: {
          padding: `0 ${constants.generalUnit}px`
        }
      }
    })
)

const BillingHistory = () => {
  const classes = useStyles()
  const [invoiceToPay, setInvoiceToPay] = useState<string | undefined>()
  usePageTrack()

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Billing History - Chainsafe Storage</title>
      </Helmet>
      <Typography
        className={classes.heading}
        variant="h1"
        component="p"
      >
        <Trans>Billing history</Trans>
      </Typography>
      <InvoiceLines payInvoice={(invoiceId) => setInvoiceToPay(invoiceId)} />
      {invoiceToPay && <PayInvoiceModal
        invoiceId={invoiceToPay}
        onClose={() => setInvoiceToPay(undefined)}
      />}
    </div>
  )
}

export default BillingHistory
