import React, { useState, useEffect, useMemo } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { CheckSubscriptionUpdate, Product, ProductPrice } from "@chainsafe/files-api-client"
import { Button, InfoCircleIcon, CreditCardIcon, Divider, formatBytes, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { PaymentMethod, useBilling } from "../../../../../Contexts/BillingContext"
import clsx from "clsx"
import { useFilesApi } from "../../../../../Contexts/FilesApiContext"

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
      fontWeight: 600
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
      maxWidth: constants.generalUnit * 56,
      color: palette.additional["gray"][7]
    },
    icon : {
      verticalAlign: "middle",
      fill: palette.additional["gray"][7],
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
  const { filesApiClient } = useFilesApi()
  const [checkSubscriptionUpdate, setCheckSubscriptionUpdate] = useState<CheckSubscriptionUpdate  | undefined>()
  const newPlanStorage = formatBytes(Number(planPrice?.metadata?.storage_size_bytes), 2)

  const isDowngrade = useMemo(() => {
    const currentPrice = currentSubscription?.product?.price?.unit_amount
    return currentPrice && currentPrice > planPrice.unit_amount
  }, [currentSubscription, planPrice])

  useEffect(() => {
    if (!currentSubscription) return

    filesApiClient.checkSubscriptionUpdate(currentSubscription?.id, {
      payment_method: paymentMethod === "creditCard" ? "stripe" : "crypto",
      price_id: planPrice.id
    })
      .then(setCheckSubscriptionUpdate)
      .catch(console.error)
  }, [currentSubscription, paymentMethod, filesApiClient, planPrice])

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
          variant="h5"
          component="h5"
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
              variant="h5"
              component="h5"
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
              data-cy="label-pay-with-crypto"
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
              data-cy="label-accepted-currencies"
            >
              <Trans>Accepted currencies</Trans>
            </Typography>
            <div className={classes.pushRightBox}>
              <Typography
                variant="body1"
                component="p"
                data-cy="label-accepted-crypto-types"
              >
                <Trans>DAI, USDC, ETH or BTC</Trans>
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
          <Trans>Pricing details</Trans>
        </Typography>
      </div>
      <div className={classes.rowBox}>
        <Typography
          component="p"
          variant="body1"
          data-cy="label-total-title"
        >
          <Trans>Plan price</Trans>
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
      {!!checkSubscriptionUpdate?.amount_from_credit &&
        <div className={classes.rowBox}>
          <Typography
            component="p"
            variant="body1"
            data-cy="label-total-title"
          >
            <Trans>Amount from credit</Trans>
          </Typography>
          <div className={classes.pushRightBox}>
            <Typography
              variant="body1"
              component="p"
              className={classes.boldText}
              data-cy="label-total-price"
            >
              {planPrice.currency}&nbsp;
              {checkSubscriptionUpdate.amount_from_credit.toFixed(2)}
            </Typography>
          </div>
        </div>
      }
      {!!checkSubscriptionUpdate?.amount_unused_from_last_bill &&
        <div className={classes.rowBox}>
          <Typography
            component="p"
            variant="body1"
            data-cy="label-total-title"
          >
            <Trans>Amount available from last bill</Trans>
          </Typography>
          <div className={classes.pushRightBox}>
            <Typography
              variant="body1"
              component="p"
              className={classes.boldText}
              data-cy="label-total-price"
            >
              {planPrice.currency}&nbsp;
              {checkSubscriptionUpdate.amount_unused_from_last_bill.toFixed(2)}
            </Typography>
          </div>
        </div>
      }
      <Divider className={classes.divider} />
      {!!checkSubscriptionUpdate && <div className={classes.rowBox}>
        <Typography
          component="h4"
          variant="h4"
        >
          <Trans>Amount due</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            variant="h4"
            component="h4"
          >
            {planPrice.currency} {checkSubscriptionUpdate?.amount_due.toFixed(2)}
          </Typography>
        </div>
      </div>
      }
      {!!checkSubscriptionUpdate?.amount_credited && <div className={classes.rowBox}>
        <Typography
          component="p"
          variant="body1"
        >
          <Trans>Amount added to credit</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <Typography
            component="p"
            variant="body1"
          >
            {planPrice.currency}&nbsp;
            {checkSubscriptionUpdate.amount_credited.toFixed(2)}
          </Typography>
        </div>
      </div>
      }
      <div className={classes.rowBox}>
        <Typography
          variant="body1"
          component="p"
          className={classes.warningText}
          data-cy="label-final-sale-warning"
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
            loading={loadingChangeSubscription || !checkSubscriptionUpdate}
            disabled={loadingChangeSubscription || !checkSubscriptionUpdate}
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