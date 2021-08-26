import React from "react"
import CurrentProduct from "./CurrentProduct"
import CurrentCard from "./CurrentCard"
import { Divider, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"

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
      <CurrentProduct />
      <CurrentCard />
    </div>
  )
}

export default PlanView
