import { Button, Typography } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import React, { useCallback, useState } from "react"
import { ShareTransferRequest, useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import CustomModal from "../Elements/CustomModal"
import LandingImage from "../../Media/devices.png"

interface Props {
    request: ShareTransferRequest
}
const ShareTransferRequestModal = ({ request }: Props) => {
  const { approveShareTransferRequest, rejectShareTransferRequest } = useThresholdKey()
  const useStyles = makeStyles(({ breakpoints, constants, palette }: ITheme) =>
    createStyles({
      root: {},
      modalInner: {
        padding: constants.generalUnit * 4,
        textAlign: "center",

        "& img" : {
          width: "min-content",
          margin: "auto",
          marginTop: constants.generalUnit * 5,
          marginBottom: constants.generalUnit * 5
        }
      },
      button: {
        width: 240,
        marginBottom: constants.generalUnit * 2,
        [breakpoints.up("md")]: {
          backgroundColor: palette.common.black.main,
          color: palette.common.white.main
        },
        [breakpoints.down("md")]: {
          backgroundColor: palette.common.black.main,
          color: palette.common.white.main
        }
      },
      buttonWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: constants.generalUnit * 4
      }
    })
  )
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  const [isLoadingApprove, setIsLoadingApprove] = useState(false)
  const [isLoadingReject, setIsLoadingReject] = useState(false)

  const onApproveRequest = useCallback((encPubKeyX: string) => {
    setIsLoadingApprove(true)
    approveShareTransferRequest(encPubKeyX)
  }, [approveShareTransferRequest])

  const onRejectRequest = useCallback((encPubKeyX: string) => {
    setIsLoadingReject(true)
    rejectShareTransferRequest(encPubKeyX)
  }, [rejectShareTransferRequest])

  return (
    <CustomModal
      active
      closePosition="none"
      maxWidth="sm"
      injectedClass={{
        inner: classes.modalInner
      }}
    >
      <>
        <Typography variant="h3">
          <Trans>Device awaiting confirmation</Trans>
        </Typography>
        <img src={LandingImage} alt="request other devices"/>
        <Typography>
          <Trans>Requested from</Trans> {`${request.browserDetail.browser.name} (${request.browserDetail.browser.version}) -
            ${request.browserDetail.os.name}`}<br/>
          <Trans>on</Trans> {dayjs(request.timestamp).format("ddd D MMMM h:mm a")}<br/>
        </Typography>
        <div className={classes.buttonWrapper}>
          <Button                   
            className={classes.button}
            variant={desktop ? "primary" : "outline"}
            size="large"
            loading={isLoadingApprove}
            disabled={isLoadingReject}
            onClick={() => {onApproveRequest(request.encPubKeyX)}}>
            <Trans>Approve</Trans>
          </Button>
          <Button 
            className={classes.button}
            variant={desktop ? "primary" : "outline"}
            size="large"
            loading={isLoadingReject}
            disabled={isLoadingApprove}
            onClick={() => {onRejectRequest(request.encPubKeyX)}}>
            <Trans>Reject</Trans>
          </Button>
        </div>
      </>

    </CustomModal>
  )
}

export default ShareTransferRequestModal