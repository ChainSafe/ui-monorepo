import React from "react"
import { formatCardNumber, formatExpiry, getCardTypeByValue } from "./utils"
import { TextInput, Typography } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      margin: `${theme.constants.generalUnit * 2}px 0`
    },
    cardNumber: {
      margin: 0,
      width: "100%",
      "& input": {
        borderRadius: 0
      }
    },
    cardExpiry: {
      margin: 0,
      width: "70%",
      "& input": {
        borderRadius: 0
      }
    },
    cardCvc: {
      margin: 0,
      width: "30%",
      "& input": {
        borderRadius: 0
      }
    },
    error: {
      color: theme.palette.error.main
    }
  })
)

interface ICardInputsProps {
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  handleChangeCardNumber(value: string): void
  handleChangeCardExpiry(value: string): void
  handleChangeCardCvc(value: string): void
  error?: string
}

const CardInputs = (props: ICardInputsProps) => {
  const classes = useStyles()

  const {
    cardNumber,
    cardExpiry,
    cardCvc,
    handleChangeCardNumber,
    handleChangeCardExpiry,
    handleChangeCardCvc,
    error
  } = props
  const cardType = getCardTypeByValue(cardNumber)

  return (
    <div className={classes.container}>
      <TextInput
        value={cardNumber}
        onChange={(val) =>
          val && handleChangeCardNumber(formatCardNumber(val.toString()))
        }
        className={classes.cardNumber}
        size="large"
        placeholder="1234 1234 1234 1234"
        RightIcon={cardType && cardType.type ? cardType.icon : undefined}
        label="Card information"
      />
      <TextInput
        value={cardExpiry}
        onChange={(val) =>
          val && handleChangeCardExpiry(formatExpiry(val.toString()))
        }
        className={classes.cardExpiry}
        size="large"
        placeholder="MM/YY"
      />
      <TextInput
        value={cardCvc}
        onChange={(val) => val && handleChangeCardCvc(val.toString())}
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
