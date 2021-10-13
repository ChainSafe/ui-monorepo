import React from "react"
import CurrentCard from "./CurrentCard"
import { Divider, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CurrentProduct from "./CurrentProduct"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
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
      </div>
    </Elements>
  )
}

export default PlanView
