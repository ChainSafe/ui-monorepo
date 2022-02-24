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
      [breakpoints.down("md")]: {
        padding: constants.generalUnit * 1.5
      }
    },
    mainHeader: {
      fontSize: 28,
      marginBottom: constants.generalUnit * 2,
      [breakpoints.up("md")]: {
        paddingLeft: constants.generalUnit * 2
      }    },
    settingsSection: {
      maxWidth: breakpoints.values["md"],
      [breakpoints.up("md")]: {
        padding: `0 ${constants.generalUnit * 2}px`
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
          className={classes.mainHeader}
        >
          <Trans>Subscription plan</Trans>
        </Typography>
        <Divider />
        <section className={classes.settingsSection}>
          <CurrentPlan />
        </section>
        <Divider />
        <section className={classes.settingsSection}>
          <CurrentCard />
        </section>
        <Divider />
        <section className={classes.settingsSection}>
          <BillingHistory />
        </section>
      </div>
    </Elements>
  )
}

export default Subscription
