import React from "react"
import { Typography, CreditCardIcon } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { useBilling } from "../../../../Contexts/BillingContext"

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    container: {
      margin: `${constants.generalUnit * 3}px ${constants.generalUnit * 4}px`
    },
    noCard: {
      margin: `${constants.generalUnit * 2}px 0`
    },
    cardDetailsContainer: {
      display: "flex",
      margin: `${constants.generalUnit * 2}px 0`
    },
    creditCardIcon: {
      marginRight: constants.generalUnit
    }
  })
)

const CurrentCard: React.FC = () => {
  const classes = useStyles()
  const { defaultCard } = useBilling()

  return (
    <div className={classes.container}>
      <div>
        <Typography
          variant="h4"
          component="h4"
        >
          <Trans>Credit card on file</Trans>
        </Typography>
      </div>
      {defaultCard
        ? <div className={classes.cardDetailsContainer}>
          <CreditCardIcon className={classes.creditCardIcon} />
          <Typography>
           •••• •••• •••• {defaultCard.last_four_digit}
          </Typography>
        </div>
        : <Typography
          component="p"
          variant="body1"
          className={classes.noCard}
        >
          <Trans>No Card</Trans>
        </Typography>
      }
    </div>
  )
}

export default CurrentCard
