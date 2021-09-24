import React, { useState } from "react"
import { Button, Grid, Typography, useToasts } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import CustomModal from "../../../Elements/CustomModal"
import CustomButton from "../../../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useBilling } from "../../../../Contexts/BillingContext"

const useStyles = makeStyles(
  ({ breakpoints, constants, typography, zIndex }: CSFTheme) => {
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

  const [loadingPaymentMethodAdd, setLoadingPaymentMethodAdd] = useState(false)

  const handlePaymentError = (error: any) => {
    console.error(error)
    onClose()
    setLoadingPaymentMethodAdd(false)
    addToast({ title: "Failed to add payment method", type: "error" })
  }

  const handleSubmitPaymentMethod = async (event: any) => {
    event.preventDefault()
    if (!stripe || !elements) return

    try {
      const cardElement = elements.getElement(CardElement)
      setLoadingPaymentMethodAdd(true)

      if (!cardElement) return
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement
      })

      if (error || !paymentMethod) {
        handlePaymentError(error)
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
          data-cy="modal-create-folder"
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
          <CardElement />
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
