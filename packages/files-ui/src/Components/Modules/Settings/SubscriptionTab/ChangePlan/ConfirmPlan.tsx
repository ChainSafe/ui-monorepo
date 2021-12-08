import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product, ProductPrice } from "@chainsafe/files-api-client"
import { Breadcrumb, Button, CreditCardIcon, Divider, formatBytes, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { useBilling } from "../../../../../Contexts/BillingContext"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
    },
    heading: {
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit * 2
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
    },
    textButton: {
      color: palette.primary.background,
      cursor: "pointer",
      textDecoration: "underline"
    },
    creditCardIcon: {
      marginRight: constants.generalUnit,
      fill: palette.additional["gray"][9]
    },
    featuresBox: {
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit * 2
    },
    creditCardRow: {
      display: "flex",
      alignItems: "center",
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit
    },
    featureSeparator: {
      marginBottom: constants.generalUnit
    },
    error: {
      marginTop: constants.generalUnit,
      color: palette.error.main
    }
  })
)

interface IConfirmPlan {
  plan: Product
  planPrice: ProductPrice
  onClose: () => void
  goToSelectPlan: () => void
  goToPlanDetails: () => void
  goToPaymentMethod: () => void
  onChangeSubscription: () => void
  loadingChangeSubscription: boolean
  isSubscriptionError: boolean
}

const ConfirmPlan = ({
  plan,
  onClose,
  planPrice,
  goToSelectPlan,
  goToPlanDetails,
  goToPaymentMethod,
  onChangeSubscription,
  loadingChangeSubscription,
  isSubscriptionError
}: IConfirmPlan) => {
  const classes = useStyles()
  const { defaultCard } = useBilling()
  const currentPlanStorage = formatBytes(Number(planPrice?.metadata?.storage_size_bytes), 2)

  return (
    <article className={classes.root}>
      <Breadcrumb
        crumbs={[{
          text: t`Change plan`,
          onClick: goToSelectPlan
        }, {
          text: t`Plan details`,
          onClick: goToPlanDetails
        }, {
          text: t`Payment method`,
          onClick: goToPaymentMethod
        }, {
          text: t`Confirm plan`
        }]}
        hideHome={true}
        showDropDown={true}
      />
      <Typography
        variant="h5"
        component="h4"
        className={classes.heading}
      >
        <Trans>Confirm plan change</Trans>
      </Typography>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography
          variant="body1"
          component="p"
          className={classes.boldText}>
          {plan.name}
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="body1"
            component="p"
            className={classes.textButton}
            onClick={goToSelectPlan}
          >
            <Trans>Edit plan</Trans>
          </Typography>
        </div>
      </div>
      <div className={clsx(classes.rowBox, classes.featuresBox)}>
        <Typography
          variant="body1"
          component="p"
        >
          <Trans>Features</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            component="p"
            variant="body1"
            className={classes.featureSeparator}
          >
            {planPrice?.metadata?.storage_size_bytes
              ? <Trans>{currentPlanStorage} of storage</Trans>
              : plan.description
            }
          </Typography>
          <Typography
            component="p"
            variant="body1">
            {plan.description}
          </Typography>
        </div>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography
          variant="body1"
          component="p"
        >
          <Trans>Payment method</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="body1"
            component="p"
            className={classes.textButton}
            onClick={goToPaymentMethod}
          >
            <Trans>Edit payment method</Trans>
          </Typography>
        </div>
      </div>
      {defaultCard &&
        <div className={classes.creditCardRow}>
          <CreditCardIcon className={classes.creditCardIcon} />
          <Typography>
           •••• •••• •••• {defaultCard.last_four_digit}
          </Typography>
        </div>
      }
      <div className={classes.rowBox}>
        <Typography
          component="p"
          variant="body1"
        >
          <Trans>Billing start time</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="body1"
            component="p"
          >
            {dayjs().format("DD MMM YYYY")}
          </Typography>
        </div>
      </div>
      <Divider className={classes.divider} />
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
          >
            {planPrice.unit_amount ? planPrice.currency : ""} {planPrice.unit_amount}
            <span className={classes.normalWeightText}>
              {planPrice.recurring.interval === "month" ? t`/month` : t`/year`}
            </span>
          </Typography>
        </div>
      </div>
      {isSubscriptionError &&
        <Typography
          component="p"
          variant="body1"
          className={classes.error}
        >
          <Trans>Failed to change subscription</Trans>
        </Typography>
      }
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={loadingChangeSubscription}
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button
            variant="primary"
            loading={loadingChangeSubscription}
            disabled={loadingChangeSubscription}
            onClick={onChangeSubscription}
          >
            <Trans>Confirm plan change</Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default ConfirmPlan