import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Breadcrumb, Button, Divider, RadioInput, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
    },
    heading: {
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit * 2
    },
    subHeading: {
      marginBottom: constants.generalUnit * 2,
      color: palette.additional["gray"][8]
    },
    boldText: {
      fontWeight: "bold"
    },
    normalWeightText: {
      fontWeight: "normal"
    },
    rowBox: {
      display: "flex",
      justifyContent: "space-between"
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
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: constants.generalUnit * 4,
      marginBottom: constants.generalUnit * 3
    },
    divider: {
      margin: `${constants.generalUnit}px 0`
    },
    radioLabel: {
      fontSize: 14
    },
    textButton: {
      color: palette.primary.main,
      cursor: "pointer"
    },
    linkButton: {
      textDecoration: "underline",
      cursor: "pointer"
    }
  })
)

interface IPaymentMethodProps {
  onClose: () => void
  goToSelectPlan: () => void
  goToPlanDetails: () => void
}

const PlanDetails = ({ onClose, goToSelectPlan, goToPlanDetails }: IPaymentMethodProps) => {
  const classes = useStyles()
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "crypto" | undefined>()
  const [view, setView] = useState<"selectPaymentMethod" | "addCard">("selectPaymentMethod")

  console.log(view)

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
          text: "Payment method"
        }]}
        hideHome={true}
      />
      <Typography variant="h5"
        component="h4"
        className={classes.heading}
      >
        <Trans>Select payment method</Trans>
      </Typography>
      <Typography variant="body1"
        component="p"
        className={classes.subHeading}
      >
        {view === "addCard" && <Trans>Select payment method</Trans>}
      </Typography>
      <Divider className={classes.divider} />

      <div className={classes.rowBox}>
        <RadioInput
          label="Credit card"
          value="creditCard"
          onChange={() => setPaymentMethod("creditCard")}
          checked={paymentMethod === "creditCard"}
          labelClassName={classes.radioLabel}
        />
        <Typography variant="body1"
          component="p"
          className={classes.textButton}
          onClick={() => setView("addCard")}
        >
          <Trans>Add credit card</Trans>
        </Typography>
      </div>
      <Divider className={classes.divider} />
      <RadioInput
        label="USDC, BTC, or ETH (Annual only)"
        value="orange"
        onChange={() => setPaymentMethod("crypto")}
        checked={paymentMethod === "crypto"}
        labelClassName={classes.radioLabel}
        disabled={true}
      />
      <Divider className={classes.divider} />
      <section className={classes.bottomSection}>
        {view === "addCard" ? <div>
          <Typography variant="body1"
            component="p"
            onClick={() => setView("selectPaymentMethod")}
            className={classes.linkButton}
          >
            <Trans>Go  back</Trans>
          </Typography>
        </div> : <div />
        }
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
            disabled={!paymentMethod}
            // onClick={handleSelectPlan}
          >
            <Trans>
              Select payment method
            </Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default PlanDetails