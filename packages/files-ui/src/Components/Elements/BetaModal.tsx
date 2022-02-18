import { Button, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import React, { useCallback } from "react"
import { CSFTheme } from "../../Themes/types"
import { ROUTE_LINKS } from "../FilesRoutes"
import CustomModal from "./CustomModal"

const useStyles = makeStyles(
  ({ constants }: CSFTheme) => {
    return createStyles({
      root: {
        padding: `${constants.generalUnit * 6}px ${constants.generalUnit * 4}px`,
        flexDirection: "column",
        display: "flex",
        alignItems: "center"
      },
      title: {
        marginBottom: constants.generalUnit * 3
      },
      modalInner: {
        maxWidth: "600px !important"
      },
      buttonContainer: {
        width: "100%"
      },
      nextButton: {
        margin: "auto",
        marginTop: constants.generalUnit * 3
      }
    })
  })

interface Props {
  onHide: () => void
}

const BetaModal = ({ onHide }: Props) => {
  const classes = useStyles()

  const onDiscordButtonClick = useCallback(() => {
    window.open(ROUTE_LINKS.DiscordInvite, "_blank")
    onHide()
  }, [onHide])

  return (
    <CustomModal
      injectedClass={{ inner: classes.modalInner }}
      active={true}
      closePosition="right"
      maxWidth="sm"
      onClose={onHide}
      mobileStickyBottom={false}
    >
      <div className={classes.root}>
        <Typography
          variant="h2"
          className={classes.title}
        >
          <Trans>Join the beta</Trans>
        </Typography>
        <Typography variant="h4">
          <Trans>Join our beta testers by requesting access in the &quot;Files-support&quot; channel on Discord.</Trans>
        </Typography>
        <div className={classes.buttonContainer}>
          <Button
            data-posthog="Beta-test-discord"
            className={classes.nextButton}
            onClick={onDiscordButtonClick}
          >
            <Trans>To Discord!</Trans>
          </Button>
        </div>
      </div>
    </CustomModal>
  )}

export default BetaModal
