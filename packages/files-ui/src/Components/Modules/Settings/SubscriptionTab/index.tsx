import React from "react"
import CurrentProduct from "./CurrentProduct"
import CurrentCard from "./CurrentCard"
import { Divider, Grid, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import BillingHistory from "./BillingHistory"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    heading: {
      marginBottom: constants.generalUnit * 2
    }
  })
)

const PlanView: React.FC = () => {
  const classes = useStyles()

  return (
    <div>
      <Typography
        variant="h3"
        component="h3"
        className={classes.heading}
      >
        <Trans>Payment and Subscriptions</Trans>
      </Typography>
      <Divider />
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
        >
          <CurrentProduct />
          <CurrentCard />
          <BillingHistory />
        </Grid>
      </Grid>
    </div>
  )
}

export default PlanView
