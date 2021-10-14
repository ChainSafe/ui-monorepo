import { Button, Link, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"
import React, { useCallback, useState } from "react"
import { CSFTheme } from "../Themes/types"
import CustomModal from "./Elements/CustomModal"
import { SETTINGS_BASE } from "./FilesRoutes"
import step1Image from "../Media/sharingExplainer/step1.png"
import step2Image from "../Media/sharingExplainer/step2.png"
import step3Image from "../Media/sharingExplainer/step3.png"
import { DISMISSED_SHARING_EXPLAINER_KEY } from "./Modules/FileBrowsers/hooks/useSharingExplainerModalFlag"
import { useUser } from "../Contexts/UserContext"

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
  showModal: boolean
  onHide: () => void
}

const STEP_NUMBER = 3

const SharingExplainerModal = ({ showModal, onHide }: Props) => {
  const classes = useStyles()
  const { setLocalStore } = useUser()
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
              alt={"share explainer step 1"}
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
              alt={"share explainer step 2"}
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
              alt={"share explainer step 3"}
            />
          </div>
        </>
    }
  }, [classes.buttonLink, classes.image, classes.imageContainer, classes.title, step])

  const onNextStep = useCallback((next : number) => {
    if (next < STEP_NUMBER) {
      setStep(next)
      return
    } else {
      switch (next) {
        case STEP_NUMBER:
          setLocalStore({ [DISMISSED_SHARING_EXPLAINER_KEY]:  "true" }, "update")
          setStep(STEP_NUMBER)
          break
        case STEP_NUMBER + 1:
          onHide()
          break
        default:
          break
      }
    }
  }, [setLocalStore, onHide])

  return (
    <CustomModal
      injectedClass={{ inner: classes.modalInner }}
      active={showModal}
      closePosition="right"
      maxWidth="sm"
      onClose={onHide}
      mobileStickyBottom={false}
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

export default SharingExplainerModal
