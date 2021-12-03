import React, { useState } from "react"
import { Typography, CreditCardIcon, Button } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { useBilling } from "../../../../Contexts/BillingContext"
import AddCardModal from "./AddCard/AddCardModal"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    container: {
      padding: constants.generalUnit,
      margin: `${constants.generalUnit * 1.5}px 0`
    },
    noCard: {
      margin: `${constants.generalUnit * 2}px 0`
    },
    cardDetailsContainer: {
      display: "flex",
      margin: `${constants.generalUnit * 2}px 0`
    },
    creditCardIcon: {
      marginRight: constants.generalUnit,
      fill: palette.additional["gray"][9]
    }
  })
)

const CurrentCard: React.FC = () => {
  const classes = useStyles()
  const [isAddCardModalOpen, setIsAddCardModalOpen ] = useState(false)
  const { defaultCard } = useBilling()

  return (
    <>
      <div className={classes.container}>
        <div>
          <Typography
            variant="h4"
            component="h4"
          >
            <Trans>Credit card saved</Trans>
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
        <Button onClick={() => setIsAddCardModalOpen(true)}>
          {defaultCard
            ? <Trans>Update Card</Trans>
            : <Trans>Add Card</Trans>
          }
        </Button>
      </div>
      <AddCardModal
        isModalOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
      />
    </>
  )
}

export default CurrentCard
