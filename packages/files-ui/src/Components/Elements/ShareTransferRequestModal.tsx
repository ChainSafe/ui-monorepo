import { Button, Loading, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ShareTransferRequest, useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import CustomModal from "../Elements/CustomModal"
import DevicesImage from "../../Media/devices.png"
import clsx from "clsx"
import { CSFTheme } from "../../Themes/types"

interface Props {
    requests: ShareTransferRequest[]
}

const useStyles = makeStyles(({ breakpoints, constants }: CSFTheme) =>
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
      },
      [breakpoints.up("sm")]: {
        top: "50%",
        left: "50%",
        display: "flex",
        position: "absolute",
        flexGrow: 1,
        transform: "translate(-50%, -50%)",
        flexDirection: "column",
        backgroundColor: "var(--gray1)",
        minHeight: 550
      },
      [breakpoints.down("sm")]: {
        backgroundColor: constants?.modalDefault?.background,
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100% !important",
        transform: "unset",
        borderRadiusLeftTop: `${constants.generalUnit * 1.5}px`,
        borderRadiusRightTop: `${constants.generalUnit * 1.5}px`,
        borderRadiusLeftBottom: 0,
        borderRadiusRightBottom: 0
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
      textDecoration: "underline",
      outline: "none",
      cursor: "pointer"
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
          {
            requests.length > 1 && (isClearing
              ? <Loading size={25} type='inherit' />
              : <Typography
                className={clsx(classes.clearAll)}
                disabled={isLoadingApprove || isLoadingReject || isClearing}
                onClick={() => {
                  if (!isLoadingApprove || !isLoadingReject || !isClearing) {
                    onClearingRequest()
                  }
                }}>
                <Trans>Reject all</Trans>
              </Typography>
            )
          }
        </div>
      </>
    </CustomModal>
  )
}

export default ShareTransferRequestModal
