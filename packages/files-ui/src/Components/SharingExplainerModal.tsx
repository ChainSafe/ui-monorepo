import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import React, { useCallback, useEffect, useState } from "react"
import { CSFTheme } from "../Themes/types"
import CustomModal from "./Elements/CustomModal"

export const DISMISSED_SHARING_EXPLAINER_KEY = "csf.dismissedSharingExplainer"

const useStyles = makeStyles(
  ({ constants, zIndex, breakpoints }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column",
        display: "flex",
        alignItems: "center"
      },
      title: {
        //
      },
      crossIconButton:{
        //
      },
      image: {
        //
      },
      modalRoot: {
        //
      },
      modalInner: {
        //
      }
    })
  })

interface Props {
    onHide?: () => void
}

const SharingExplainerModal = ({ onHide }: Props) => {
  const classes = useStyles()
  const { localStorageGet, localStorageSet } = useLocalStorage()
  const [showModal, setShowModal] = useState(false)
  const dismissedFlag = localStorageGet(DISMISSED_SHARING_EXPLAINER_KEY)

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
    onHide && onHide()
    localStorageSet(DISMISSED_SHARING_EXPLAINER_KEY, "true")
    setShowModal(false)
  }, [localStorageSet, onHide])

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
          variant="body1"
          className={classes.title}>
          <Trans>
            Are we on the right track? Let us know in less than 1 minute.
          </Trans>
        </Typography>
        <div className={classes.image}>
        </div>
      </div>
    </CustomModal>
  )}

export default SharingExplainerModal
