import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product, ProductPrice } from "@chainsafe/files-api-client"
import { Breadcrumb, Button, Divider, Typography } from "@chainsafe/common-components"
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

interface IConfirmPlan {
  plan: Product
  planPrice: ProductPrice
  onClose: () => void
  goToSelectPlan: () => void
  goToPlanDetails: () => void
  goToPaymentMethod: () => void
  onChangeSubscription: () => void
  loadingChangeSubscription: boolean
}

const ConfirmPlan = ({
  plan,
  onClose,
  planPrice,
  goToSelectPlan,
  goToPlanDetails,
  goToPaymentMethod,
  onChangeSubscription,
  loadingChangeSubscription
}: IConfirmPlan) => {
  const classes = useStyles()

  return (
    <article className={classes.root}>
      <Breadcrumb
        crumbs={[{
          text: "Change plan",
          onClick: goToSelectPlan
        }, {
          text: "Plan details",
          onClick: goToPlanDetails
        }, {
          text: "Payment method",
          onClick: goToPaymentMethod
        }, {
          text: "Confirm plan"
        }]}
        showDropDown={true}
        hideHome={true}
      />
      <Typography variant="h5"
        component="h4"
        className={classes.heading}
      >
        {plan.name}
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
          >
            {planPrice.currency} ${planPrice.unit_amount}
            <span className={classes.normalWeightText}>
              {planPrice.recurring.interval === "month" ? "/month" : "/year"}
            </span>
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
            loading={loadingChangeSubscription}
            onClick={onChangeSubscription}
          >
            <Trans>
              Confirm plan change
            </Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default ConfirmPlan