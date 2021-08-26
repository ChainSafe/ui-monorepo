import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { Button, Link, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"
import React, { useCallback, useEffect, useState } from "react"
import { CSFTheme } from "../Themes/types"
import CustomModal from "./Elements/CustomModal"
import { SETTINGS_BASE } from "./FilesRoutes"
import step1Image from "../Media/sharingExplaner/step1.png"
import step2Image from "../Media/sharingExplaner/step2.png"
import step3Image from "../Media/sharingExplaner/step3.png"

export const DISMISSED_SHARING_EXPLAINER_KEY = "csf.dismissedSharingExplainer"

const useStyles = makeStyles(
  ({ palette, constants }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column",
        display: "flex",
        alignItems: "center"
      },
      title: {
        textAlign: "center",
        marginBottom: constants.generalUnit * 3
      },
      crossIconButton:{
        //
      },
      modalRoot: {
        //
      },
      modalInner: {
        maxWidth: "400px !important"
      },
      buttonLink: {
        outline: "none",
        textDecoration: "underline",
        cursor: "pointer",
        textAlign: "center",
        marginBottom: constants.generalUnit * 2
      },
      buttonContainer: {
        width: "100%"
      },
      nextButton: {
        marginLeft: "auto",
        marginTop: constants.generalUnit
      },
      stepDisplay: {
        fontSize: 35,
        color: palette.additional["gray"][5],
        "& span" : {
          cursor: "pointer",
          marginLeft: constants.generalUnit / 2,
          marginRight: constants.generalUnit / 2
        },
        "& .active": {
          color: palette.additional["gray"][10]
        }
      },
      image: {
        maxWidth: "100%",
        margin: "auto"
      },
      imageContainer: {
        alignItems: "center",
        display: "flex",
        width: 300,
        margin: "0 auto",
        height: 300
      }
    })
  })

interface Props {
    onHide?: () => void
}

const STEP_NUMBER = 3

const SharingExplanerModal = ({ onHide }: Props) => {
  const classes = useStyles()
  const { localStorageGet, localStorageSet } = useLocalStorage()
  const [showModal, setShowModal] = useState(false)
  const dismissedFlag = localStorageGet(DISMISSED_SHARING_EXPLAINER_KEY)
  const [step, setStep] = useState(1)

  const Slides = useCallback(() => {
    switch (step) {
    default:
      return <>
        <div className={classes.title}>
          <Trans>You can now create shared folders to share a file.</Trans></div>
        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src={step1Image}
          />
        </div>
      </>

    case 2:
      return <>
        <div className={classes.title}
        ><Trans>Add viewers and editors by username, sharing id or Ethereum address.</Trans></div>
        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src={step2Image}
          />
        </div>
      </>

    case 3:
      return <>
        <div className={classes.title}>
          <Trans>Create your public username in <Link
            className={classes.buttonLink}
            to={`${SETTINGS_BASE}/profile`}
          >Settings</Link>!
          </Trans>
        </div>
        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src={step3Image}
          />
        </div>
      </>
    }
  }, [classes.buttonLink, classes.image, classes.imageContainer, classes.title, step])

  useEffect(() => {
    if (dismissedFlag === "false"){
      setShowModal(true)
    }
  }, [dismissedFlag])

  useEffect(() => {
    // the dismiss flag was never set
    if (dismissedFlag === null) {
      localStorageSet(DISMISSED_SHARING_EXPLAINER_KEY, "false")
      setShowModal(true)
    }
  }, [dismissedFlag, localStorageSet])

  const onClose = useCallback(() => {
    console.log("hop")
    onHide && onHide()
    localStorageSet(DISMISSED_SHARING_EXPLAINER_KEY, "true")
    setShowModal(false)
  }, [localStorageSet, onHide])

  const onNextStep = useCallback((next : number) => {
    if (next < STEP_NUMBER) {
      setStep(next)
      return
    } else {
      switch (next) {
      case 3:
        localStorageSet(DISMISSED_SHARING_EXPLAINER_KEY, "true")
        setStep(3)
        break
      case STEP_NUMBER + 1:
        onClose()
        break
      default:
        break
      }
    }


  }, [localStorageSet, onClose])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={showModal}
      closePosition="right"
      maxWidth="sm"
      onClose={onClose}
    >
      <div className={classes.root}>
        <Typography
          variant="h2"
        >
          <Slides/>
        </Typography>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.nextButton}
            onClick={() => onNextStep(step + 1)}
          >
            {step === STEP_NUMBER ? t`Got it` : t`Next`}
          </Button>
        </div>
        <div
          className={classes.stepDisplay}
        >
          {new Array(STEP_NUMBER).fill(undefined).map((_, index) =>
            <span
              key={index}
              className={index === step - 1 ? "active" : ""}
              onClick={() => onNextStep(index + 1)}
            >•</span>
          )}
        </div>
      </div>
    </CustomModal>
  )}

export default SharingExplanerModal
