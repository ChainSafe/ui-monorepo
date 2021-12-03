import React from "react"
import CurrentCard from "./CurrentCard"
import { Divider, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import BillingHistory from "./BillingHistory"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CurrentProduct from "./CurrentPlan"

const useStyles = makeStyles(({ breakpoints, constants }: ITheme) =>
  createStyles({
    root: {
      [breakpoints.down("sm")]: {
        paddingLeft: constants.generalUnit,
        paddingRight: constants.generalUnit
      }
    }
  })
)

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK || "")

const PlanView: React.FC = () => {
  const classes = useStyles()

  return (
    <Elements stripe={stripePromise}>
      <div className={classes.root}>
        <Typography
          variant="h3"
          component="h3"
        >
          <Trans>Payment and Subscriptions</Trans>
        </Typography>
        <Divider />
        <CurrentProduct />
        <CurrentCard />
        <BillingHistory />
      </div>
    </Elements>
  )
}

export default PlanView