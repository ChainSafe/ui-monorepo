import React from "react"
import CurrentProduct from "./CurrentProduct"
import CurrentCard from "./CurrentCard"
import { Divider, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    heading: {
      marginBottom: constants.generalUnit * 2
    }
  })
)

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK || "")

const PlanView: React.FC = () => {
  const classes = useStyles()

  return (
    <Elements stripe={stripePromise}>
      <div>
        <Typography
          variant="h3"
          component="h3"
          className={classes.heading}
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
