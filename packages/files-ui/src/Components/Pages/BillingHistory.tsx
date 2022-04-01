import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { Typography } from "@chainsafe/common-components"
import { Trans, t } from "@lingui/macro"
import InvoiceLines from "../Elements/InvoiceLines"
import PayInvoiceModal from "../Modules/Settings/SubscriptionTab/PayInvoice/PayInvoiceModal"
import { Helmet } from "react-helmet-async"

const useStyles = makeStyles(
  ({ constants, breakpoints }: CSFTheme) =>
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

  return (
    <>
      <Helmet>
        <title>{t`Billing history`} - Chainsafe Files</title>
      </Helmet>
      <div className={classes.root}>
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
    </>
  )
}

export default BillingHistory
