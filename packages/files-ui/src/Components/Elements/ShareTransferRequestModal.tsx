import { Button, Typography } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ShareTransferRequest, useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import CustomModal from "../Elements/CustomModal"
import DevicesImage from "../../Media/devices.png"
import clsx from "clsx"

interface Props {
    requests: ShareTransferRequest[]
}

const useStyles = makeStyles(({ constants }: ITheme) =>
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
      marginBottom: constants.generalUnit * 2
    },
    buttonWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: constants.generalUnit * 4,
      flexWrap: "wrap"
    },
    clearAll: {
      marginTop: constants.generalUnit
    }
  })
)

const ShareTransferRequestModal = ({ requests }: Props) => {
  const { approveShareTransferRequest, rejectShareTransferRequest, clearShareTransferRequests } = useThresholdKey()
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  const [isLoadingApprove, setIsLoadingApprove] = useState(false)
  const [isLoadingReject, setIsLoadingReject] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const { browserDetail, encPubKeyX, timestamp } = useMemo(() => requests[requests.length - 1], [requests])

  useEffect(() => {
    // reset the buttons state for each new request displayed
    setIsLoadingApprove(false)
    setIsLoadingReject(false)
  }, [timestamp])

  const onApproveRequest = useCallback(() => {
    setIsLoadingApprove(true)
    approveShareTransferRequest(encPubKeyX)
  }, [approveShareTransferRequest, encPubKeyX])

  const onRejectRequest = useCallback(() => {
    setIsLoadingReject(true)
    rejectShareTransferRequest(encPubKeyX)
  }, [rejectShareTransferRequest, encPubKeyX])

  const onClearingRequest = useCallback(() => {
    setIsClearing(true)
    clearShareTransferRequests()
  }, [clearShareTransferRequests])

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
          <Trans>Device awaiting confirmation</Trans>{requests.length > 1 ? ` (1/${requests.length})` : ""}
        </Typography>
        <img src={DevicesImage} alt="request other devices"/>
        <Typography>
          <Trans>Requested from</Trans> {`${browserDetail.browser.name} (${browserDetail.browser.version}) -
            ${browserDetail.os.name}`}<br/>
          <Trans>on</Trans> {dayjs(timestamp).format("ddd D MMMM h:mm a")}<br/>
        </Typography>
        <div className={classes.buttonWrapper}>
          <Button
            className={classes.button}
            variant={desktop ? "primary" : "outline"}
            size="large"
            loading={isLoadingApprove}
            disabled={isLoadingReject || isLoadingApprove || isClearing}
            onClick={onApproveRequest}>
            <Trans>Approve</Trans>
          </Button>
          <Button
            className={classes.button}
            variant={desktop ? "primary" : "outline"}
            size="large"
            loading={isLoadingReject}
            disabled={isLoadingApprove || isLoadingReject || isClearing}
            onClick={onRejectRequest}>
            <Trans>Reject</Trans>
          </Button>
          {requests.length > 1 && <Button
            className={clsx(classes.button, classes.clearAll)}
            variant={desktop ? "primary" : "outline"}
            size="large"
            fullsize
            loading={isClearing}
            disabled={isLoadingApprove || isLoadingReject || isClearing}
            onClick={onClearingRequest}>
            <Trans>Reject all</Trans>
          </Button>}
        </div>
      </>
    </CustomModal>
  )
}

export default ShareTransferRequestModal