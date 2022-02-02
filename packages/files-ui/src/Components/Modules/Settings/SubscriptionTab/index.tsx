import React, { useEffect } from "react"
import CurrentCard from "./CurrentCard"
import { Divider, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import BillingHistory from "./BillingHistory"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CurrentPlan from "./CurrentPlan"
import { useBilling } from "../../../../Contexts/BillingContext"

const useStyles = makeStyles(({ breakpoints, constants }: ITheme) =>
  createStyles({
    root: {
      maxWidth: breakpoints.values["md"],
      [breakpoints.down("md")]: {
        padding: constants.generalUnit * 1.5
      }
    }
  })
)

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK || "")

const Subscription: React.FC = () => {
  const classes = useStyles()
  const { refreshDefaultCard, fetchCurrentSubscription } = useBilling()

  useEffect(() => {
    // this is needed for testing when a card is deleted programmatically
    refreshDefaultCard()
    // or when a plan is changed programmatically
    fetchCurrentSubscription()
  }, [fetchCurrentSubscription, refreshDefaultCard])

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
        <CurrentPlan />
        <CurrentCard />
        <BillingHistory />
      </div>
    </Elements>
  )
}

export default Subscription
