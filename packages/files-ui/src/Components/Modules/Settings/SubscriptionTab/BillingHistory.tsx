import React from "react"
import { Typography, Link } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../../FilesRoutes"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    container: {
      margin: `${constants.generalUnit * 3}px ${constants.generalUnit * 4}px`
    },
    noCard: {
      margin: `${constants.generalUnit * 2}px 0`
    },
    cardDetailsContainer: {
      display: "flex",
      margin: `${constants.generalUnit * 2}px 0`
    },
    creditCardIcon: {
      marginRight: constants.generalUnit,
      fill: palette.additional["gray"][9]
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
      <Link to={ROUTE_LINKS.BillingHistory}><Trans>View invoces</Trans></Link>
    </div>
  )
}

export default BillingHistory
