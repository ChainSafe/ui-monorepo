import React, { FormEvent, useMemo, useState } from "react"
import { Button, Grid, Typography, useToasts } from "@chainsafe/common-components"
import { createStyles, makeStyles, useTheme, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import CustomButton from "../../../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js"
import { useFilesApi } from "../../../../../Contexts/FilesApiContext"
import { useBilling } from "../../../../../Contexts/BillingContext"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, animation }: CSFTheme) => {
    return createStyles({
      root: {
        flexDirection: "column"
      },
      okButton: {
        marginLeft: constants.generalUnit
      },
      label: {
        fontSize: 14,
        lineHeight: "22px"
      },
      cardNumberInputs: {
        marginBottom: constants.generalUnit * 2,
        [breakpoints.down("md")]: {
          marginTop: constants.generalUnit * 2,
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
      },
      backButton: {
        flex: 1,
        display: "flex",
        alignItems: "center"
      },
      linkButton: {
        textDecoration: "underline",
        cursor: "pointer"
      }
    })
  }
)

interface IAddCardProps {
  submitText: string
  onCardAdd?: () => void
  onClose?: () => void
  goBack?: () => void
  footerClassName?: string
}


const AddCard = ({ onClose, onCardAdd, footerClassName, submitText, goBack }: IAddCardProps) => {
  const classes = useStyles()
  const stripe = useStripe()
  const elements = useElements()
  const { addToast } = useToasts()
  const { filesApiClient } = useFilesApi()
  const { refreshDefaultCard, deleteCard, updateDefaultCard, defaultCard } = useBilling()
  const [focusElement, setFocusElement] = useState<"number" | "expiry" | "cvc" | undefined>(undefined)
  const [cardAddError, setCardAddError] = useState<string | undefined>(undefined)
  const theme: CSFTheme = useTheme()
  const isUpdate = useMemo(() => !!defaultCard, [defaultCard])
  const { desktop } = useThemeSwitcher()

  const [loadingPaymentMethodAdd, setLoadingPaymentMethodAdd] = useState(false)

  const handleSubmitPaymentMethod = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCardAddError(undefined)
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
        console.error(error)
        setLoadingPaymentMethodAdd(false)
        setCardAddError(t`Card inputs invalid`)
        return
      }

      const setupIntent = await filesApiClient.createSetupIntent()
      const setupIntentResult = await stripe.confirmCardSetup(setupIntent.secret, {
        payment_method: paymentMethod.id
      })

      if (setupIntentResult.error || !setupIntentResult.setupIntent) {
        console.error(error)
        setLoadingPaymentMethodAdd(false)
        setCardAddError(t`Failed to add payment method`)
        return
      }
      isUpdate && defaultCard && await deleteCard(defaultCard)
      await updateDefaultCard(paymentMethod.id)
      refreshDefaultCard()
      onCardAdd && onCardAdd()
      setLoadingPaymentMethodAdd(false)
      addToast({ title: isUpdate ? t`Card updated` : t`Card added`, type: "success" })
    } catch (error) {
      console.error(error)
      setLoadingPaymentMethodAdd(false)
      setCardAddError(t`Failed to add payment method`)
    }
  }

  return (
    <form onSubmit={handleSubmitPaymentMethod}>
      <div
        className={classes.root}
        data-cy="form-add-card"
      >
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
          onChange={() => setCardAddError(undefined)}
        />
        <div className={classes.expiryCvcContainer}>
          <CardExpiryElement
            className={clsx(
              classes.cardInputs,
              focusElement === "expiry" && classes.cardInputsFocus
            )}
            onFocus={() => setFocusElement("expiry")}
            onBlur={() => setFocusElement(undefined)}
            onChange={() => setCardAddError(undefined)}
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
            onChange={() => setCardAddError(undefined)}
            options={{ style: {
              base: {
                color: theme.constants.addCard.color
              }
            } }}
          />
        </div>
        {cardAddError && <Typography
          component="p"
          variant="body1"
          className={classes.error}
        >
          {cardAddError}
        </Typography>
        }
        <Grid
          item
          flexDirection="row"
          className={footerClassName}
        >
          <div className={classes.backButton}>
            {goBack &&
              <Typography
                variant="body1"
                component="p"
                onClick={goBack}
                className={classes.linkButton}
              >
                <Trans>Go  back</Trans>
              </Typography>
            }
          </div>
          {onClose &&
            <CustomButton
              data-cy="button-cancel-create-folder"
              onClick={onClose}
              size="medium"
              variant={desktop ? "outline" : "gray"}
              type="button"
              disabled={loadingPaymentMethodAdd}
            >
              <Trans>Cancel</Trans>
            </CustomButton>
          }
          <Button
            data-cy="button-create-folder"
            size="medium"
            variant="primary"
            type="submit"
            className={classes.okButton}
            loading={loadingPaymentMethodAdd}
            disabled={loadingPaymentMethodAdd}
          >
            {submitText}
          </Button>
        </Grid>
      </div>
    </form>
  )
}

export default AddCard
