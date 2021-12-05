import React, { useMemo } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product } from "@chainsafe/files-api-client"
import {  Button, CrossIcon, formatBytes, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import { useBilling } from "../../../../../Contexts/BillingContext"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
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
    tickIcon: {
      fill: palette.error.main
    },
    invoiceText: {
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit
    }
  })
)

interface IConfirmDowngrade {
  plan: Product
  goToSelectPlan: () => void
  onClose: () => void
  plans?: Product[]
}

const ConfirmDowngrade = ({
  plan,
  goToSelectPlan,
  plans
}: IConfirmDowngrade) => {
  const classes = useStyles()
  const { currentSubscription } = useBilling()
  const currentPlan = useMemo(() => plans?.find(p => p.id === plan.id), [plan.id, plans])
  const currentStorage = formatBytes(Number(currentPlan?.prices[0].metadata?.storage_size_bytes), 2)

  if (!currentSubscription)
    return null

  return (
    <article className={classes.root}>
      <Typography
        variant="body1"
        component="p"
        className={classes.headingBadge}
      >
        <Trans>Downgrade Confirmation</Trans>
      </Typography>
      <div>
        <Typography
          variant="body1"
          component="p"
          className={classes.featuresTitle}
        >
          <Trans>You would loose the following features: </Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <div className={clsx(classes.middleRowBox, classes.featureTickBox)}>
            <CrossIcon className={classes.tickIcon} />
            <Typography component="p"
              variant="body1"
            >
              {currentStorage
                ? <Trans><b>{currentStorage}</b> of storage</Trans >
                : plan.description
              }
            </Typography>
          </div>
          <div className={classes.middleRowBox}>
            <CrossIcon className={classes.tickIcon} />
            <Typography component="p"
              variant="body1">
              {currentSubscription?.product.description}
            </Typography>
          </div>
        </div>
      </div>
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={goToSelectPlan}
            variant="secondary"
          >
            <Trans>
              Back
            </Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default ConfirmDowngrade