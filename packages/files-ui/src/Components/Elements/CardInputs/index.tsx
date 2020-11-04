import React from "react"
import {
  formatCardNumber,
  formatExpiry,
  getCardTypeByValue,
  getCardNumberError,
  getExpiryDateError,
  getCVCError,
} from "./utils"
import { TextInput, AppleLogoIcon, Typography } from "@imploy/common-components"

import { makeStyles, ITheme, createStyles } from "@imploy/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      margin: `${theme.constants.generalUnit * 2}px 0`,
    },
    cardNumber: {
      margin: 0,
      width: "100%",
      "& input": {
        borderRadius: 0,
      },
    },
    cardExpiry: {
      margin: 0,
      width: "70%",
      "& input": {
        borderRadius: 0,
      },
    },
    cardCvc: {
      margin: 0,
      width: "30%",
      "& input": {
        borderRadius: 0,
      },
    },
    error: {
      color: theme.palette.error.main,
    },
  }),
)

const CardInputs = () => {
  const classes = useStyles()

  const [cardNumber, setCardNumber] = React.useState("")
  const [cardExpiry, setCardExpiry] = React.useState("")
  const [cvv, setCardCvv] = React.useState("")
  const [error, setError] = React.useState<string | undefined>(undefined)
  const cardType = getCardTypeByValue(cardNumber)

  const onSubmit = () => {
    const error =
      getCardNumberError(cardNumber) ||
      getExpiryDateError(cardExpiry) ||
      getCVCError(cvv, getCardTypeByValue(cardNumber))

    setError(error)
    if (error) {
      return
    }

    // call parent
  }

  return (
    <div className={classes.container}>
      <TextInput
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        className={classes.cardNumber}
        size="large"
        placeholder="1234 1234 1234 1234"
        RightIcon={AppleLogoIcon}
        label="Card information"
      />
      {cardType && cardType.type && (
        <svg width={24} height={16}>
          {cardType.icon}
        </svg>
      )}
      <TextInput
        value={cardExpiry}
        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
        className={classes.cardExpiry}
        size="large"
        placeholder="MM/YY"
      />
      <TextInput
        value={cvv}
        onChange={(e) => setCardCvv(e.target.value)}
        className={classes.cardCvc}
        size="large"
        placeholder="CVC"
      />
      {error && (
        <Typography variant="body2" className={classes.error}>
          {error}
        </Typography>
      )}
    </div>
  )
}

export default CardInputs
