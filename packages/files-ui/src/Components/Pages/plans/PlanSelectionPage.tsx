import {
  ArrowLeftSvg,
  capitalize,
  Divider,
  Link,
  RadioInput,
  Typography,
} from "@imploy/common-components"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import clsx from "clsx"
import React, { useState } from "react"
import {
  ISubscriptionOption,
  PLAN_OPTION,
  SubscriptionOptions,
} from "../../../Utils/SubscriptionOptions"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles(({ constants, palette, breakpoints }: ITheme) =>
  createStyles({
    root: {
      "& h1": {
        marginBottom: constants.generalUnit,
      },
    },
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
    options: {
      marginTop: constants.generalUnit * 7,
    },
    planList: {
      marginTop: constants.generalUnit * 1.5,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    plan: {
      [breakpoints.up("md")]: {
        width: `calc(33% - ${constants.generalUnit * 1.5}px)`,
      },
      padding: constants.generalUnit * 4.5,
      border: `1px solid transparent`,
      fontWeight: 600,

      [`&.${PLAN_OPTION.Plus}`]: {
        backgroundColor: palette.additional["gray"][6],
        borderColor: palette.additional["gray"][6],
        color: palette.common.black.main,
        "& .feature": {
          color: palette.additional["gray"][9],
        },
      },
      [`&.${PLAN_OPTION.Agile}`]: {
        backgroundColor: palette.additional["blue"][7],
        color: palette.common.white.main,
        "& *": {
          color: palette.common.white.main,
        },
      },
      [`&.${PLAN_OPTION.Enterprise}`]: {
        color: palette.common.white.main,
        backgroundColor: palette.additional["gray"][9],
        "& *": {
          color: palette.common.white.main,
        },
      },
    },
    planTitle: {
      marginBottom: constants.generalUnit * 3,
    },
    planQualities: {
      minHeight: 150,
      "& p": {
        fontWeight: 400,
        marginBottom: constants.generalUnit,
      },
    },
    planPrice: {
      minHeight: constants.generalUnit * 9.5,
    },
    planFooter: {},
    divider: {
      marginTop: constants.generalUnit * 5,
      marginBottom: constants.generalUnit * 3,
      [`&.${PLAN_OPTION.Plus}`]: {
        "&:before,&:after": {
          backgroundColor: palette.common.black.main,
        },
      },
      [`&.${PLAN_OPTION.Agile}`]: {
        "&:before,&:after": {
          backgroundColor: palette.common.white.main,
        },
      },
      [`&.${PLAN_OPTION.Enterprise}`]: {
        "&:before,&:after": {
          backgroundColor: palette.common.white.main,
        },
      },
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
      <section className={classes.options}>
        <Typography variant="h4" component="h4">
          We've got plans that suit all sizes of storage needs:
        </Typography>
        <section className={classes.planList}>
          {SubscriptionOptions.map(
            (plan: ISubscriptionOption, index: number) => (
              <div
                key={`plan-${index}`}
                className={clsx(classes.plan, plan.name)}
              >
                <div className={classes.planTitle}>
                  <Typography variant="h4" component="h4">
                    For {plan.audience}
                  </Typography>
                  <Typography variant="h2" component="h2">
                    {capitalize(plan.name)}
                  </Typography>
                </div>
                <div className={classes.planQualities}>
                  <Typography variant="h5" component="p">
                    {plan.details.blurb}
                  </Typography>
                  {plan.details.features.map(
                    (feature: string, featIndex: number) => (
                      <Typography
                        key={`plan-${index}-${featIndex}`}
                        className={"feature"}
                        variant="h5"
                        component="p"
                      >
                        {feature}
                      </Typography>
                    ),
                  )}
                </div>
                <Typography
                  className={classes.planPrice}
                  variant="h2"
                  component="p"
                >
                  ${plan.price} USD/month
                </Typography>
                <footer className={classes.planFooter}>
                  <Link to={ROUTE_LINKS.CardPayment(plan.name)}>
                    <Typography variant="h4" component="p">
                      Try for 7 days
                    </Typography>
                  </Link>
                  <Divider className={clsx(classes.divider, plan.name)} />
                  <Link to={ROUTE_LINKS.CardPayment(plan.name)}>
                    <Typography variant="h4" component="p">
                      Purchase with Card
                    </Typography>
                  </Link>
                  <Link to={ROUTE_LINKS.CryptoPayment(plan.name)}>
                    <Typography variant="h4" component="p">
                      Purchase with Crypto
                    </Typography>
                  </Link>
                </footer>
              </div>
            ),
          )}
        </section>
      </section>
    </article>
  )
}

export default PlanSelectionPage
