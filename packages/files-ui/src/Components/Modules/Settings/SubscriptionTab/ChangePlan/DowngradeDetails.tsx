import React, { useCallback, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product } from "@chainsafe/files-api-client"
import {  Button, CrossIcon, formatBytes, Typography } from "@chainsafe/common-components"
import {  Trans } from "@lingui/macro"
import clsx from "clsx"
import { useBilling } from "../../../../../Contexts/BillingContext"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: constants.generalUnit * 2
    },
    headingBadge: {
      color: palette.additional["gray"][7],
      marginTop: constants.generalUnit * 3
    },
    headingBox: {
      marginTop: constants.generalUnit * 2,
      marginBottom: constants.generalUnit * 2
    },
    rowBox: {
      display: "flex",
      padding: `${constants.generalUnit * 0.5}px 0px`
    },
    middleRowBox: {
      display: "flex",
      alignItems: "center"
    },
    featuresTitle: {
      marginTop: constants.generalUnit * 2,
      marginBottom: constants.generalUnit * 2
    },
    pushRightBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginLeft: constants.generalUnit * 4
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
    featuresBox: {
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit * 2
    },
    featureTickBox: {
      marginBottom: constants.generalUnit
    },
    textLink: {
      color: palette.primary.background
    },
    checkCircleIcon:  {
      fill: palette.additional["gray"][7],
      marginLeft: constants.generalUnit
    },
    crossIcon: {
      fill: palette.error.main,
      fontSize: constants.generalUnit * 2,
      marginRight: constants.generalUnit
    },
    invoiceText: {
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit
    }
  })
)

interface IConfirmDowngrade {
  plan: Product
  goBack: () => void
  goToPlanDetails: () => void
  shouldCancelPlan: boolean
  onClose: () => void
}

const DowngradeDetails = ({ plan, goBack, goToPlanDetails, shouldCancelPlan, onClose }: IConfirmDowngrade) => {
  const classes = useStyles()
  const { currentSubscription, cancelCurrentSubscription } = useBilling()
  const currentStorage = formatBytes(Number(currentSubscription?.product?.price.metadata?.storage_size_bytes), 2)
  const [isCancelingPlan, setIsCancellingPlan] = useState(false)

  const onCancelPlan = useCallback(() => {
    setIsCancellingPlan(true)
    cancelCurrentSubscription()
      .catch(console.error)
      .finally(() => {
        setIsCancellingPlan(true)
        onClose()
      })
  }, [cancelCurrentSubscription, onClose])

  if (!currentSubscription)
    return null

  return (
    <article className={classes.root}>
      <header className={classes.header}>
        <Typography
          component="p"
          variant="h4"
        >
          <Trans>Change plan</Trans>
        </Typography>
      </header>
      <div>
        <Typography
          variant="body1"
          component="p"
          className={classes.featuresTitle}
        >
          <Trans>You would lose the following features:</Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <div className={clsx(classes.middleRowBox, classes.featureTickBox)}>
            <CrossIcon className={classes.crossIcon} />
            <Typography
              component="p"
              variant="body1"
            >
              {currentStorage
                ? <Trans><b>{currentStorage}</b> of storage</Trans >
                : plan.description
              }
            </Typography>
          </div>
          <div className={classes.middleRowBox}>
            <CrossIcon className={classes.crossIcon} />
            <Typography
              component="p"
              variant="body1"
            >
              {currentSubscription?.product.description}
            </Typography>
          </div>
        </div>
      </div>
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={goBack}
            variant="secondary"
            disabled={isCancelingPlan}
          >
            <Trans>Go back</Trans>
          </Button>
          {
            shouldCancelPlan
              ? <Button
                variant="primary"
                onClick={onCancelPlan}
                loading={isCancelingPlan}
                disabled={isCancelingPlan}
              >
                <Trans>Switch to Free plan</ Trans>
              </Button>
              : <Button
                variant="primary"
                onClick={goToPlanDetails}
              >
                <Trans>Switch Plan</ Trans>
              </Button>
          }
        </div>
      </section>
    </article>
  )
}

export default DowngradeDetails