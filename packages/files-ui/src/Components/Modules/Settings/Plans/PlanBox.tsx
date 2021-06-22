import React from "react"
import { Divider, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, palette, typography }: CSFTheme) =>
  createStyles({
    container: {
      border: "1px solid",
      borderColor: palette.additional["gray"][3],
      color: "inherit",
      padding: `${constants.generalUnit * 4}px ${constants.generalUnit * 4}px ${constants.generalUnit * 5}px`
    },
    planFor: {
      fontSize: 18,
      color: "inherit"
    },
    title: {
      fontSize: 30,
      margin: `${constants.generalUnit * 2}px 0px ${constants.generalUnit * 4}px`
    },
    feature: {
      margin: `${constants.generalUnit * 0.5}px 0px`
    },
    price: {
      fontWeight: "bold",
      margin: `${constants.generalUnit * 3}px 0px ${constants.generalUnit * 6}px`
    },
    buttonLink: {
      outline: "none",
      textDecoration: "underline",
      cursor: "pointer",
      textAlign: "left",
      ...typography.body1,
      fontWeight: "bold"
    },
    divider:  {
      margin: `${constants.generalUnit * 3}px 0px`
    }
  })
)

interface PlanBoxProps {
  plan: {
    title: string
    planFor: string
    prices: {
      monthly: number
      yearly: number
    }
    features: string[]
  }
  billingPeriod: "monthly" | "yearly"
  rootClass: string
}

const PlanBox = ({ plan, billingPeriod, rootClass }: PlanBoxProps) => {
  const classes = useStyles()
  const { title, planFor, prices: { monthly, yearly }, features } = plan

  return (
    <div className={clsx(classes.container, rootClass)}>
      <Typography
        variant="h4"
        component="h4"
        className={classes.planFor}
      >
        {planFor}
      </Typography>
      <Typography
        variant="h3"
        component="h3"
        className={classes.title}
      >
        {title}
      </Typography>
      {features.map((feature, index) => (
        <Typography
          key={index}
          variant="body1"
          component="p"
          className={classes.feature}
        >
          {feature}
        </Typography>
      ))
      }
      <Typography
        variant="h3"
        component="h3"
        className={classes.price}
      >
        {`$${billingPeriod === "monthly" ? monthly : yearly} USD/${billingPeriod === "monthly"  ? "month" : "year"}`}
      </Typography>
      <div
        className={classes.buttonLink}
      >
        Try for 7 days
      </div>
      <Divider className={classes.divider} />
      <div
        className={classes.buttonLink}
      >
        Purchase with card
      </div>
    </div>
  )
}

export default PlanBox