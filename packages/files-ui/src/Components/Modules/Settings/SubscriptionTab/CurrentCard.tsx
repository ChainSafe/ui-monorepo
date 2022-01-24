import React, { useState } from "react"
import { Typography, CreditCardIcon, Button, Dialog } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"
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
    },
    linkButton: {
      textDecoration: "underline",
      cursor: "pointer",
      margin:  `0 ${constants.generalUnit * 2}px`
    },
    confirmDeletionDialog: {
      top: "50%"
    }
  })
)

const CurrentCard: React.FC = () => {
  const classes = useStyles()
  const [isAddCardModalOpen, setIsAddCardModalOpen ] = useState(false)
  const { defaultCard, deleteCard, refreshDefaultCard } = useBilling()
  const [isDeleteCardModalOpen, setIsDeleteCardModalOpen] = useState(false)
  const [isDeleteCardLoading, setIsDeleteCardLoading] = useState(false)

  const onRemoveCard = () =>  {
    if (!defaultCard) return
    setIsDeleteCardLoading(true)
    deleteCard(defaultCard)
      .then(refreshDefaultCard)
      .catch(console.error)
      .finally(() => {
        setIsDeleteCardModalOpen(false)
        setIsDeleteCardLoading(false)
      })
  }

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
            <Typography
              variant="body1"
              component="p"
              data-cy="label-default-card"
            >
              •••• •••• •••• {defaultCard.last_four_digit}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.linkButton}
              onClick={() => setIsDeleteCardModalOpen(true)}
              data-cy="link-remove-card"
            >
              <Trans>Remove</Trans>
            </Typography>
          </div>
          : <Typography
            component="p"
            variant="body1"
            className={classes.noCard}
            data-cy="label-no-card"
          >
            <Trans>No Card</Trans>
          </Typography>
        }
        <Button
          {...(defaultCard
            ? { testId: "update-a-card" }
            : { testId: "add-a-card" }
          )}
          onClick={() => setIsAddCardModalOpen(true)}>
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
      <Dialog
        active={isDeleteCardModalOpen}
        reject={() => setIsDeleteCardModalOpen(false)}
        accept={onRemoveCard}
        requestMessage={t`Are you sure? This will delete your default payment method.`}
        rejectText={t`Cancel`}
        acceptText={t`Confirm`}
        acceptButtonProps={{ loading: isDeleteCardLoading, disabled: isDeleteCardLoading, testId: "confirm-remove" }}
        rejectButtonProps={{ disabled: isDeleteCardLoading, testId: "cancel-remove" }}
        injectedClass={{ inner: classes.confirmDeletionDialog }}
        testId="remove-card-confirmation"
      />
    </>
  )
}

export default CurrentCard
