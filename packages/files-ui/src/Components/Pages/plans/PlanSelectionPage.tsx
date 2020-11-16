import {
  ArrowLeftSvg,
  Link,
  RadioInput,
  Typography,
} from "@imploy/common-components"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import React, { useState } from "react"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles(
  ({ palette, constants, typography, breakpoints }: ITheme) =>
    createStyles({
      root: {},
      controls: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      back: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        "& svg": {
          display: "block",
          height: 10,
          width: 10,
          marginRight: constants.generalUnit,
        },
      },
      durationOptions: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      radio: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
    }),
)
const PlanSelectionPage = () => {
  const classes = useStyles()

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly",
  )
  // TODO: wire up to selection/subscription state once finalised
  return (
    <article className={classes.root}>
      <Typography variant="h1" component="h1">
        Choose your plan
      </Typography>
      <section className={classes.controls}>
        <Link to={ROUTE_LINKS.Settings()} className={classes.back}>
          <ArrowLeftSvg />
          <Typography>Back to Plan Settings</Typography>
        </Link>
        <div className={classes.durationOptions}>
          <RadioInput
            className={classes.radio}
            value="monthly"
            label="Billed Monthly"
            checked={billingPeriod === "monthly"}
            onChange={(e) => {
              setBillingPeriod("monthly")
            }}
          />
          <RadioInput
            className={classes.radio}
            value="annual"
            label="Billed Annual"
            checked={billingPeriod === "annual"}
            onChange={(e) => {
              setBillingPeriod("annual")
            }}
          />
        </div>
      </section>
    </article>
  )
}

export default PlanSelectionPage
