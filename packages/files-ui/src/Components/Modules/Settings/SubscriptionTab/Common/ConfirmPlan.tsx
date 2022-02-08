import React, { useMemo } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product, ProductPrice } from "@chainsafe/files-api-client"
import { Button, InfoCircleIcon, CreditCardIcon, Divider, formatBytes, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { PaymentMethod, useBilling } from "../../../../../Contexts/BillingContext"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root:  {
      position: "relative",
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
    },
    warningText: {
      marginTop: constants.generalUnit * 2,
      maxWidth: constants.generalUnit * 56
    },
    icon : {
      verticalAlign: "middle",
      fill: palette.error.main,
      "& > svg": {
        height: constants.generalUnit * 2.25
      }
    }
  })
)

interface IConfirmPlan {
  plan: Product
  planPrice: ProductPrice
  goToSelectPlan: () => void
  goToPaymentMethod: () => void
  onChangeSubscription: () => void
  loadingChangeSubscription: boolean
  paymentMethod: PaymentMethod
  subscriptionErrorMessage?: string
}

const ConfirmPlan = ({
  plan,
  planPrice,
  goToSelectPlan,
  goToPaymentMethod,
  onChangeSubscription,
  loadingChangeSubscription,
  paymentMethod,
  subscriptionErrorMessage
}: IConfirmPlan) => {
  const classes = useStyles()
  const { defaultCard } = useBilling()
  const { currentSubscription } = useBilling()
  const newPlanStorage = formatBytes(Number(planPrice?.metadata?.storage_size_bytes), 2)
  const isDowngrade = useMemo(() => {
    const currentPrice = currentSubscription?.product?.price?.unit_amount
    return currentPrice && currentPrice > planPrice.unit_amount
  }, [currentSubscription, planPrice]
  )

  return (
    <article className={classes.root}>
      <Typography
        variant="h5"
        component="h4"
        className={classes.heading}
        data-cy="header-confirm-change"
      >
        {
          isDowngrade
            ? <Trans>Confirm plan downgrade</Trans>
            : <Trans>Confirm plan change</Trans>
        }
      </Typography>
      <Divider className={classes.divider} />
      <div className={classes.rowBox}>
        <Typography
          variant="body1"
          component="p"
          className={classes.boldText}
          data-cy="label-selected-plan">
          {plan.name}
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="body1"
            component="p"
            className={classes.textButton}
            onClick={goToSelectPlan}
            data-cy="link-edit-plan"
          >
            <Trans>Edit plan</Trans>
          </Typography>
        </div>
      </div>
      <div className={clsx(classes.rowBox, classes.featuresBox)}>
        <Typography
          variant="body1"
          component="p"
          data-cy="label-features-title"
        >
          <Trans>Features</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            component="p"
            variant="body1"
            className={classes.featureSeparator}
            data-cy="label-features-summary"
          >
            <Trans>{newPlanStorage} of storage</Trans>
          </Typography>
        </div>
      </div>
      <Divider className={classes.divider} />
      {paymentMethod === "creditCard" && defaultCard &&
        <>
          <div className={classes.rowBox}>
            <Typography
              variant="body1"
              component="p"
              data-cy="label-selected-payment-method"
            >
              <Trans>Payment method</Trans>
            </Typography>
            <div className={classes.pushRightBox}>
              <Typography
                variant="body1"
                component="p"
                className={classes.textButton}
                onClick={goToPaymentMethod}
                data-cy="link-edit-payment-method"
              >
                <Trans>Edit payment method</Trans>
              </Typography>
            </div>
          </div>
          <div className={classes.creditCardRow}>
            <CreditCardIcon className={classes.creditCardIcon} />
            <Typography
              data-cy="label-selected-card-number"
            >
              •••• •••• •••• {defaultCard.last_four_digit}
            </Typography>
          </div>
        </>
      }
      {paymentMethod === "crypto" &&
        <>
          <div className={classes.rowBox}>
            <Typography
              variant="body1"
              component="p"
            >
              <Trans>Pay with Crypto</Trans>
            </Typography>
            <div className={classes.pushRightBox}>
              <Typography
                variant="body1"
                component="p"
                className={classes.textButton}
                onClick={goToPaymentMethod}
              >
                <Trans>Edit payment</Trans>
              </Typography>
            </div>
          </div>
          <div>
          </div>
          <div className={classes.pushRightBox} />
          <div className={classes.rowBox}>
            <Typography
              component="p"
              variant="body1"
            >
              <Trans>Accepted currencies</Trans>
            </Typography>
            <div className={classes.pushRightBox}>
              <Typography
                variant="body1"
                component="p"
              >
                DAI, USDC, ETH or BTC
              </Typography>
            </div>
          </div>
        </>
      }
      <div className={classes.rowBox}>
        <Typography
          component="p"
          variant="body1"
          data-cy="label-billing-title"
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
      <div className={classes.rowBox}>
        <Typography
          component="h5"
          variant="h5"
          className={classes.boldText}
          data-cy="label-total-title"
        >
          <Trans>Total</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="body1"
            component="p"
            className={classes.boldText}
            data-cy="label-total-price"
          >
            {planPrice.unit_amount ? planPrice.currency : ""} {planPrice.unit_amount}
            <span className={classes.normalWeightText}>
              {planPrice.recurring.interval === "month" ? t`/month` : t`/year`}
            </span>
          </Typography>
        </div>
      </div>
      <div className={classes.rowBox}>
        <Typography
          variant="body1"
          component="p"
          className={classes.warningText}
        >
          <InfoCircleIcon className={classes.icon} />
          {paymentMethod === "crypto"
            ? <Trans>
              Once you proceed, your account is expected to make a payment within 60 minutes. If no payment is received
              , your plan will not change.
            </Trans>
            : <Trans>
              Payments are final and non-refundable. If you wish to change your plan,
              any extra funds will be applied as credit towards future payments.
            </Trans>
          }
        </Typography>
      </div>
      {subscriptionErrorMessage &&
        <Typography
          component="p"
          variant="body1"
          className={classes.error}
          data-cy="label-change-plan-error"
        >
          {subscriptionErrorMessage}
        </Typography>
      }
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={goToPaymentMethod}
            variant="text"
            disabled={loadingChangeSubscription}
            testId="go-back-to-payment-method"
          >
            <Trans>Go back</Trans>
          </Button>
          <Button
            variant="primary"
            loading={loadingChangeSubscription}
            disabled={loadingChangeSubscription}
            onClick={onChangeSubscription}
            testId="confirm-plan-change"
          >
            {paymentMethod === "creditCard"
              ? <Trans>Confirm plan change</Trans>
              : <Trans>Proceed to payment</Trans> }
          </Button>
        </div>
      </section>
    </article>
  )
}

export default ConfirmPlan