import React, { FormEvent, useState } from "react"
import { Button, Grid, Typography, useToasts } from "@chainsafe/common-components"
import { createStyles, makeStyles, useTheme } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import CustomModal from "../../../Elements/CustomModal"
import CustomButton from "../../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useBilling } from "../../../../Contexts/BillingContext"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ breakpoints, constants, typography, zIndex, palette, animation }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column"
      },
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {}
      },
      modalInner: {
        backgroundColor: constants.createFolder.backgroundColor,
        color: constants.createFolder.color,
        [breakpoints.down("md")]: {
          bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
      },
      okButton: {
        marginLeft: constants.generalUnit
      },
      cancelButton: {
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight
        }
      },
      label: {
        fontSize: 14,
        lineHeight: "22px"
      },
      heading: {
        color: constants.createFolder.color,
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        marginBottom: constants.generalUnit * 2
      },
      footer: {
        marginTop: constants.generalUnit * 4
      },
      cardNumberInputs: {
        marginBottom: constants.generalUnit * 2,
        [breakpoints.down("md")]: {
          marginBottom: constants.generalUnit * 2
        }
      },
      cardInputs: {
        border: `1px solid ${palette.additional["gray"][6]}`,
        borderRadius: 2,
        padding: constants.generalUnit * 1.5,
        transitionDuration: `${animation.transform}ms`,
        "&:hover": {
          borderColor: palette.primary.border
        }
      },
      cardInputsFocus: {
        borderColor: palette.primary.border,
        boxShadow: constants.addCard.shadow
      },
      expiryCvcContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        marginTop: constants.generalUnit,
        gridColumnGap: constants.generalUnit,
        [breakpoints.down("md")]: {
          gridTemplateColumns: "1fr",
          gridRowGap: constants.generalUnit * 2
        }
      },
      error: {
        marginTop: constants.generalUnit * 2,
        color: palette.error.main
      }
    })
  }
)

interface IAddCardModalProps {
  isModalOpen: boolean
  onClose: () => void
}

const AddCardModal = ({ isModalOpen, onClose }: IAddCardModalProps) => {
  const classes = useStyles()
  const stripe = useStripe()
  const elements = useElements()
  const { addToast } = useToasts()
  const { filesApiClient } = useFilesApi()
  const { refreshDefaultCard } = useBilling()
  const [focusElement, setFocusElement] = useState<"number" | "expiry" | "cvc" | undefined>(undefined)
  const [isInputError, setInputError] = useState(false)
  const theme: CSFTheme = useTheme()

  const [loadingPaymentMethodAdd, setLoadingPaymentMethodAdd] = useState(false)

  const handlePaymentError = (error: any) => {
    console.error(error)
    onClose()
    setLoadingPaymentMethodAdd(false)
    addToast({ title: t`Failed to add payment method`, type: "error" })
  }

  const handleSubmitPaymentMethod = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setInputError(false)
    if (!stripe || !elements) return
    try {
      const cardNumberElement = elements.getElement(CardNumberElement)
      if (!cardNumberElement) return

      setLoadingPaymentMethodAdd(true)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement
      })

      if (error || !paymentMethod) {
        setInputError(true)
        setLoadingPaymentMethodAdd(false)
        return
      }

      const setupIntent = await filesApiClient.createSetupIntent()
      const setupIntentResult = await stripe.confirmCardSetup(setupIntent.secret, {
        payment_method: paymentMethod.id
      })

      if (setupIntentResult.error || !setupIntentResult.setupIntent) {
        handlePaymentError(setupIntentResult.error)
        return
      }
      refreshDefaultCard()
      onClose()
      setLoadingPaymentMethodAdd(false)
      addToast({ title: "Payment method added", type: "success" })
    } catch (error) {
      handlePaymentError(error)
    }
  }

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={isModalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmitPaymentMethod}>
        <div
          className={classes.root}
          data-cy="modal-add-card"
        >
          <Grid
            item
            xs={12}
            sm={12}
          >
            <Typography
              className={classes.heading}
              variant="h4"
              component="h4"
            >
              <Trans>Add a credit card</Trans>
            </Typography>
          </Grid>
          <CardNumberElement
            className={clsx(
              classes.cardInputs,
              classes.cardNumberInputs,
              focusElement === "number" && classes.cardInputsFocus
            )}
            options={{ showIcon: true, style: {
              base: {
                color: theme.constants.addCard.color
              }
            } }}
            onFocus={() => setFocusElement("number")}
            onBlur={() => setFocusElement(undefined)}
            onChange={() => setInputError(false)}
          />
          <div className={classes.expiryCvcContainer}>
            <CardExpiryElement
              className={clsx(
                classes.cardInputs,
                focusElement === "expiry" && classes.cardInputsFocus
              )}
              onFocus={() => setFocusElement("expiry")}
              onBlur={() => setFocusElement(undefined)}
              onChange={() => setInputError(false)}
              options={{ style: {
                base: {
                  color: theme.constants.addCard.color
                }
              } }}
            />
            <CardCvcElement
              className={clsx(
                classes.cardInputs,
                focusElement === "cvc" && classes.cardInputsFocus
              )}
              onFocus={() => setFocusElement("cvc")}
              onBlur={() => setFocusElement(undefined)}
              onChange={() => setInputError(false)}
              options={{ style: {
                base: {
                  color: theme.constants.addCard.color
                }
              } }}
            />
          </div>
          {isInputError &&
            <Typography
              component="p"
              variant="body1"
              className={classes.error}
            >
              <Trans>Card inputs invalid</Trans>
            </Typography>
          }
          <Grid
            item
            flexDirection="row"
            justifyContent="flex-end"
            className={classes.footer}
          >
            <CustomButton
              data-cy="button-cancel-create-folder"
              onClick={onClose}
              size="medium"
              className={classes.cancelButton}
              variant="outline"
              type="button"
              disabled={loadingPaymentMethodAdd}
            >
              <Trans>Cancel</Trans>
            </CustomButton>
            <Button
              data-cy="button-create-folder"
              size="medium"
              variant="primary"
              type="submit"
              className={classes.okButton}
              loading={loadingPaymentMethodAdd}
              disabled={loadingPaymentMethodAdd}
            >
              <Trans>Add card</Trans>
            </Button>
          </Grid>
        </div>
      </form>
    </CustomModal>
  )
}

export default AddCardModal
