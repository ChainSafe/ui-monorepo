import React, { useState } from "react"
import { Typography, CreditCardIcon, Button, Dialog } from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"
import { useBilling } from "../../../../Contexts/BillingContext"
import AddCardModal from "./AddCard/AddCardModal"
import clsx from "clsx"
import dayjs from "dayjs"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    container: {
      padding: `${constants.generalUnit}px 0`,
      margin: `${constants.generalUnit * 1.5}px 0`
    },
    spaceBetweenBox: {
      display: "flex",
      justifyContent: "space-between"
    },
    heading: {
      flex: 1
    },
    cardLineMargins: {
      margin: `${constants.generalUnit * 2}px 0`
    },
    cardDetailsContainer: {
      display: "flex"
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
    },
    link: {
      color: palette.primary.main,
      paddingRight: "0px !important"
    }
  })
)

const CurrentCard: React.FC = () => {
  const classes = useStyles()
  const [isAddCardModalOpen, setIsAddCardModalOpen ] = useState(false)
  const { defaultCard, deleteCard, refreshDefaultCard, currentSubscription } = useBilling()
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

  console.log(currentSubscription)

  return (
    <>
      <div className={classes.container}>
        <div className={classes.spaceBetweenBox}>
          <Typography
            variant="h4"
            component="h4"
            className={classes.heading}
          >
            <Trans>Payment information</Trans>
          </Typography>
          <Button
            {...(defaultCard
              ? { testId: "update-a-card" }
              : { testId: "add-a-card" }
            )}
            onClick={() => setIsAddCardModalOpen(true)}
            variant="link"
            className={classes.link}
          >
            {defaultCard
              ? <Trans>Update Card</Trans>
              : <Trans>Add Card</Trans>
            }
          </Button>
        </div>
        {currentSubscription?.expiry_date && <div className={clsx(classes.spaceBetweenBox, classes.cardLineMargins)}>
          <Typography
            variant="body1"
            component="p"
          >
            <Trans>Next payment</Trans>
          </Typography>
          <Typography
            variant="body1"
            component="p"
          >
            {dayjs.unix(currentSubscription.expiry_date).format("MMMM DD, YYYY")}
          </Typography>
        </div>
        }
        {defaultCard
          ? <div className={clsx(classes.spaceBetweenBox, classes.cardLineMargins)}>
            <div className={classes.cardDetailsContainer}>
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
            <Typography
              variant="body1"
              component="p"
            >
              <Trans>expires</Trans>&nbsp;{defaultCard.exp_month}/{defaultCard.exp_year.toString().substring(2)}
            </Typography>
          </div>
          : <Typography
            component="p"
            variant="body1"
            className={classes.cardLineMargins}
            data-cy="label-no-card"
          >
            <Trans>No Card</Trans>
          </Typography>
        }
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
