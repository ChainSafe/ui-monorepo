import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Button, Divider, RadioInput, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import AddCard from "../AddCard/AddCard"
import { PaymentMethod, useBilling } from "../../../../../Contexts/BillingContext"
import { ProductPrice } from "@chainsafe/files-api-client"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root: {
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
      justifyContent: "flex-end",
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
      color: palette.primary.background,
      cursor: "pointer"
    },
    linkButton: {
      textDecoration: "underline",
      cursor: "pointer"
    },
    addCardWrapper: {
      padding: `${constants.generalUnit * 2}px 0px`
    },
    footer: {
      marginTop: constants.generalUnit * 2
    }
  })
)

interface IPaymentMethodProps {
  selectedProductPrice: ProductPrice
  onClose: () => void
  goBack: () => void
  onSelectPaymentMethod: (paymentMethod: PaymentMethod) => void
}

const PaymentMethodSelector = ({ selectedProductPrice, goBack, onSelectPaymentMethod }: IPaymentMethodProps) => {
  const classes = useStyles()
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "crypto" | undefined>()
  const [view, setView] = useState<"selectPaymentMethod" | "addCard">("selectPaymentMethod")
  const { defaultCard } = useBilling()

  useEffect(() => {
    if (defaultCard) {
      setPaymentMethod("creditCard")
    }
  }, [defaultCard])

  return (
    <article className={classes.root}>
      <Typography
        variant="h5"
        component="h4"
        className={classes.heading}
      >
        <Trans>Select payment method</Trans>
      </Typography>
      <Typography
        variant="body1"
        component="p"
        className={classes.subHeading}
      >
        {view === "addCard" && <Trans>This card will become your default payment method</Trans>}
      </Typography>
      <Divider className={classes.divider} />
      {view === "selectPaymentMethod" && <>
        <div className={classes.rowBox}>
          <RadioInput
            label={defaultCard ? `•••• •••• •••• ${defaultCard.last_four_digit}` : "Credit card"}
            value="creditCard"
            onChange={() => setPaymentMethod("creditCard")}
            checked={paymentMethod === "creditCard"}
            labelClassName={classes.radioLabel}
            disabled={!defaultCard}
          />
          <Typography
            variant="body1"
            component="p"
            className={classes.textButton}
            onClick={() => setView("addCard")}
          >
            {defaultCard
              ? <Trans>Update credit card</Trans>
              : <Trans>Add credit card</Trans>
            }
          </Typography>
        </div>
        <Divider className={classes.divider} />
        <RadioInput
          label="USDC, DAI, BTC, or ETH (Annual only)"
          value="crypto"
          onChange={() => setPaymentMethod("crypto")}
          checked={paymentMethod === "crypto"}
          labelClassName={classes.radioLabel}
          // TODO Revert once testing is finished
          disabled={selectedProductPrice.recurring.interval !== "day"}
        />
      </>
      }
      {view === "addCard" && <div className={classes.addCardWrapper}>
        <AddCard
          submitText={t`Use this card`}
          footerClassName={classes.footer}
          onCardAdd={() => setView("selectPaymentMethod")}
          goBack={() => setView("selectPaymentMethod")}
        />
      </div>
      }
      <Divider className={classes.divider} />
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={goBack}
            variant="text"
          >
            <Trans>Go back</Trans>
          </Button>
          <Button
            variant="primary"
            disabled={!paymentMethod || view === "addCard"}
            onClick={() => paymentMethod && onSelectPaymentMethod(paymentMethod)}
          >
            <Trans>Select payment method</Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default PaymentMethodSelector