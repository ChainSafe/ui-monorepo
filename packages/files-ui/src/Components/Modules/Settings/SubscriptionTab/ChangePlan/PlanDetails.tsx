import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product, ProductPrice } from "@chainsafe/files-api-client"
import { Breadcrumb, Button, Divider, formatBytes, ToggleSwitch, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"

const useStyles = makeStyles(({ constants }: CSFTheme) =>
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
  onClose: () => void
  goToSelectPlan: () => void
  onSelectPlanPrice: (planPrice: ProductPrice) => void
}

const PlanDetails = ({ plan, onClose, goToSelectPlan, onSelectPlanPrice }: IPlanDetails) => {
  const classes = useStyles()

  const monthlyPrice = plan.prices.find((price) => price.recurring.interval === "month")
  const yearlyPrice = plan.prices.find((price) => price.recurring.interval === "year")

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(monthlyPrice ? "monthly" : "yearly")

  const handleSelectPlan = () => {
    if(billingPeriod === "monthly" && monthlyPrice) {
      onSelectPlanPrice(monthlyPrice)
    } else if (yearlyPrice) {
      onSelectPlanPrice(yearlyPrice)
    }
  }

  return (
    <article className={classes.root}>
      <Breadcrumb
        crumbs={[{
          text: "Change plan",
          onClick: goToSelectPlan
        }, {
          text: "Plan details"
        }]}
        hideHome={true}
      />
      <Typography variant="h5"
        component="h4"
        className={classes.heading}
      >
        {plan.name}
      </Typography>
      <Typography variant="body1"
        component="p"
        className={classes.subheading}
      >
        <Trans>You get access to these features right now.</Trans>
      </Typography>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography variant="body1"
          component="p"
          className={classes.boldText}>
          <Trans>Features</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography component="p"
            variant="body1"
            className={classes.featureSeparator}
          >
            {monthlyPrice?.metadata?.storage_size_bytes
              ? <>
                <b>{formatBytes(Number(monthlyPrice?.metadata?.storage_size_bytes), 2)}&nbsp;</b>
                <Trans>of storage</Trans >
              </>
              : plan.description
            }
          </Typography>
          <Typography component="p"
            variant="body1">
            {plan.description}
          </Typography>
        </div>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography component="p"
          variant="body1"
          className={classes.boldText}>
          <Trans>Billing start time</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography variant="body1"
            component="p">{dayjs().format("DD MMM YYYY")}</Typography>
        </div>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.middleRowBox}>
        <Typography component="p"
          variant="body1"
          className={classes.boldText}>
          {billingPeriod === "monthly"
            ? <Trans>Monthly billing</Trans>
            : <Trans>Yearly billing</Trans>
          }
        </Typography>
        <div className={classes.pushRightBox}>
          <ToggleSwitch
            left={{ value: "yearly" }}
            right={{ value: "monthly" }}
            onChange={() =>
              setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")
            }
          />
        </div>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography component="h5"
          variant="h5"
          className={classes.boldText}>
          <Trans>Total</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography variant="body1"
            component="p"
            className={classes.boldText}
          >{billingPeriod === "monthly"
              ? `${monthlyPrice?.currency} ${monthlyPrice?.unit_amount}`
              : `${yearlyPrice?.currency} ${yearlyPrice?.unit_amount}`
            }<span className={classes.normalWeightText}>{billingPeriod ? "/month" : "/year"}</span>
          </Typography>
        </div>
      </div>
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={() => onClose()}
            variant="secondary"
          >
            <Trans>
              Cancel
            </Trans>
          </Button>
          <Button
            variant="primary"
            onClick={handleSelectPlan}
          >
            <Trans>
              Select this plan
            </Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default PlanDetails