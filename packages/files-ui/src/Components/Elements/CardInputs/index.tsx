import React from "react"
import { formatCardNumber, formatExpiry, getCardTypeByValue } from "./utils"
import { Grid, TextInput, Typography } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    error: {
      color: palette.error.main,
      paddingLeft: constants.generalUnit
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
    <Grid container>
      <Grid
        item
        sm={12}
        md={6}
      >
        <TextInput
          value={cardNumber}
          onChange={(val) =>
            handleChangeCardNumber(formatCardNumber(val?.toString() || ""))
          }
          size="large"
          placeholder="1234 1234 1234 1234"
          RightIcon={cardType && cardType.type ? cardType.icon : undefined}
          label="Card number"
        />
      </Grid>
      <Grid
        item
        sm={6}
        md={3}
      >
        <TextInput
          value={cardExpiry}
          onChange={(val) =>
            handleChangeCardExpiry(formatExpiry(val?.toString() || ""))
          }
          size="large"
          placeholder="MM/YY"
          label="Card expiry"
        />
      </Grid>
      <Grid
        item
        sm={6}
        md={3}
      >
        <TextInput
          value={cardCvc}
          onChange={(val) => handleChangeCardCvc(val?.toString() || "")}
          size="large"
          placeholder="CVC"
          label="Card CVC"
        />
      </Grid>
      <Grid
        item
        sm={12}
        md={12}
      >
        {error && (
          <Typography
            variant="body1"
            className={classes.error}
          >
            {error}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default CardInputs
