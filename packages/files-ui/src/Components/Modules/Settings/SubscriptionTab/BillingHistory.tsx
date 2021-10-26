import React from "react"
import { Typography, Link } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../../FilesRoutes"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    container: {
      padding: constants.generalUnit,
      margin: `${constants.generalUnit * 1.5}px 0`
    },
    link: {
      display: "inline-block",
      margin: `${constants.generalUnit * 2}px 0`
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
        variant="h5"
        component="h5"
      >
        <Link
          className={classes.link}
          to={ROUTE_LINKS.BillingHistory}
        >
          <Trans>View invoices</Trans>
        </Link>
      </Typography>
    </div>
  )
}

export default BillingHistory
