import React from "react"
import { Typography, Link } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import InvoiceLines from "../../../Elements/InvoiceLines"

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

  return (
    <div className={classes.container}>
      <Typography
        variant="h4"
        component="h4"
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
      <InvoiceLines lineNumber={3}/>
    </div>
  )
}

export default BillingHistory
