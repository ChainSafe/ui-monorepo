import React, { useMemo } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSSTheme } from "../../../../Themes/types"
import { Product, ProductPrice, ProductPriceRecurringInterval } from "@chainsafe/files-api-client"
import { Button, Divider, formatBytes, ToggleSwitch, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import dayjs from "dayjs"

const useStyles = makeStyles(({ constants }: CSSTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
    },
    heading: {
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit
    },
    subheading: {
      marginBottom: constants.generalUnit * 3
    },
    boldText: {
      fontWeight: "bold"
    },
    normalWeightText: {
      fontWeight: "normal"
    },
    featureSeparator: {
      marginBottom: constants.generalUnit
    },
    rowBox: {
      display: "flex",
      padding: `${constants.generalUnit * 0.5}px 0px`
    },
    middleRowBox: {
      display: "flex",
      alignItems: "center",
      padding: `${constants.generalUnit * 0.5}px 0px`
    },
    pushRightBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      flex: 1
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      "& > *": {
        marginLeft: constants.generalUnit
      }
    },
    bottomSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      margin: `${constants.generalUnit * 3}px 0px`
    },
    divider: {
      margin: `${constants.generalUnit}px 0`
    }
  })
)

interface IPlanDetails {
  plan: Product
  goToSelectPlan: () => void
  onSelectPlanPrice: () => void
  billingPeriod: ProductPriceRecurringInterval
  onChangeBillingPeriod: (paymentPeriod: ProductPriceRecurringInterval) => void
  monthlyPrice?: ProductPrice
  yearlyPrice?: ProductPrice
}

const PlanDetails = ({
  plan,
  goToSelectPlan,
  onSelectPlanPrice,
  billingPeriod,
  onChangeBillingPeriod,
  monthlyPrice,
  yearlyPrice
}: IPlanDetails) => {
  const classes = useStyles()
  const currentPlanStorage = useMemo(() => formatBytes(Number(monthlyPrice?.metadata?.storage_size_bytes), 2), [monthlyPrice])
  const percentageOff = useMemo(() =>  monthlyPrice && yearlyPrice &&
    (((monthlyPrice.unit_amount * 12) - yearlyPrice.unit_amount) * 100) / (monthlyPrice.unit_amount * 12)
  , [monthlyPrice, yearlyPrice])

  return (
    <article className={classes.root}>
      <Typography
        variant="h5"
        component="h4"
        className={classes.heading}
        data-cy="header-selected-plan"
      >
        {plan.name}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        className={classes.subheading}
        data-cy="label-selected-plan-subheader"
      >
        <Trans>You get access to these features right now.</Trans>
      </Typography>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography
          variant="body1"
          component="p"
          className={classes.boldText}
          data-cy="label-features"
        >
          <Trans>Features</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            component="p"
            variant="body1"
            className={classes.featureSeparator}
            data-cy="label-storage-details"
          >
            <Trans>{currentPlanStorage} of storage</Trans>
          </Typography>
        </div>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography
          component="p"
          variant="body1"
          className={classes.boldText}
          data-cy="label-billing"
        >
          <Trans>Billing start time</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="body1"
            component="p"
            data-cy="label-billing-start-date"
          >
            {dayjs().format("DD MMM YYYY")}
          </Typography>
        </div>
      </div>
      <Divider className={classes.divider} />
      {monthlyPrice && yearlyPrice &&
        <>
          <div className={classes.middleRowBox}>
            <Typography
              component="p"
              variant="body1"
              className={classes.boldText}
              data-cy="label-annual-billing"
            >
              <Trans>Annual billing
                {percentageOff && percentageOff > 0 && ` (${Math.round(percentageOff)}% off)`}
              </Trans>
            </Typography>
            <div className={classes.pushRightBox}>
              <ToggleSwitch
                left={{ value: "month" }}
                right={{ value: "year" }}
                testId="duration"
                onChange={onChangeBillingPeriod}
                value={billingPeriod}
              />
            </div>
          </div>
          <Divider className={classes.divider} />
        </>
      }
      <div className={classes.rowBox}>
        <Typography
          component="h5"
          variant="h5"
          className={classes.boldText}
        >
          <Trans>Total</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="body1"
            component="p"
            className={classes.boldText}
            data-cy="label-total-cost"
          >
            {billingPeriod === "month"
              ? `${monthlyPrice?.unit_amount ? monthlyPrice?.currency : ""} ${monthlyPrice?.unit_amount}`
              : `${yearlyPrice?.unit_amount ? yearlyPrice?.currency : ""} ${yearlyPrice?.unit_amount}`
            }
            <span className={classes.normalWeightText}>{billingPeriod === "month" ? t`/month` : t`/year`}</span>
          </Typography>
        </div>
      </div>
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={() => goToSelectPlan()}
            variant="text"
            testId="go-back-to-plan-selection"
          >
            <Trans>Go back</Trans>
          </Button>
          <Button
            variant="primary"
            onClick={onSelectPlanPrice}
            testId="select-this-plan"
          >
            <Trans>Select this plan</Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default PlanDetails