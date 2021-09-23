import React, { useCallback } from "react"
import { Button, Grid, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import CustomModal from "../../../Elements/CustomModal"
import CustomButton from "../../../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"

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

interface ICreateFolderModalProps {
  isModalOpen: boolean
  onClose: () => void
}

const CreateFolderModal = ({ isModalOpen, onClose }: ICreateFolderModalProps) => {
  const classes = useStyles()
  // const [cardInputs, setCardInputs] = useState({
  //   cardNumber: "",
  //   cardExpiry: "",
  //   cardCvc: ""
  // })
  // const [cardName, setCardName] = useState("")
  // const [error, setError] = useState("")
  // const [loading, setLoading] = useState(false)
  // const { addCard, getCardTokenFromStripe } = useBilling()
  // const { addToast } = useToasts()

  const { filesApiClient } = useFilesApi()

  const onCloseModal = useCallback(() => {
    // setCardInputs({ cardNumber: "", cardExpiry: "", cardCvc: "" })
    // setCardName("")
    // setError("")
    onClose()
  }, [onClose])

  // const onSubmitCard = useCallback((e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const error = !cardName
  //     ? t`Name on card is required`
  //     : getCardNumberError(cardInputs.cardNumber) ||
  //     getExpiryDateError(cardInputs.cardExpiry) ||
  //     getCVCError(cardInputs.cardCvc, cardInputs.cardNumber)

  //   if (error) {
  //     setError(error)
  //     return
  //   }
  //   setError("")

  //   setLoading(true)
  //   // get token from stripe
  //   getCardTokenFromStripe(cardInputs).then((resp) => {
  //     // send stripe token to API
  //     addCard(resp.data.id)
  //       .then(() => {
  //         onCloseModal()
  //         addToast({
  //           title: t`Card added successfully`,
  //           type: "success"
  //         })
  //       }).catch((e) => {
  //         setError(t`Something went wrong, please try again`)
  //         console.error(e)
  //       }).finally(() => setLoading(false))
  //   }).catch((err) => {
  //     console.error(err)
  //     setError(t`Card details could not be validated`)
  //     setLoading(false)
  //   })
  // }, [cardName, cardInputs, getCardTokenFromStripe, addCard, onCloseModal, addToast])

  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: any) => {
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    if (cardElement) {
      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement
      })
      if (error) {
        console.log("[error]", error)
        return
      } else {
        console.log("[PaymentMethod]", paymentMethod)
      }
      if (paymentMethod) {

        const setupIntent = await filesApiClient.createSetupIntent()
        console.log(setupIntent.secret)

        await stripe.confirmCardSetup(setupIntent.secret, {
          payment_method: paymentMethod.id
        })
      }
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
      <form onSubmit={handleSubmit}>
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
              onClick={onCloseModal}
              size="medium"
              className={classes.cancelButton}
              variant="outline"
              type="button"
              // disabled={loading}
            >
              <Trans>Cancel</Trans>
            </CustomButton>
            <Button
              data-cy="button-create-folder"
              size="medium"
              variant="primary"
              type="submit"
              className={classes.okButton}
              // loading={loading}
              // disabled={loading}
            >
              <Trans>Add card</Trans>
            </Button>
          </Grid>
        </div>
      </form>
    </CustomModal>
  )
}

export default CreateFolderModal
