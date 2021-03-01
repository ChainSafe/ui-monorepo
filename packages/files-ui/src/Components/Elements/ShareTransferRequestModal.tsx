import { Button, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import React from "react"
import { ShareTransferRequest, useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import CustomModal from "../Elements/CustomModal"

interface Props {
    requests: ShareTransferRequest[]
}
const ShareTransferRequestModal = ({ requests }: Props) => {
  const { approveShareTransferRequest, rejectShareTransferRequest } = useThresholdKey()
  const useStyles = makeStyles(() =>
    createStyles({
      root: {},
      modalInner: {}
    })
  )
  const classes = useStyles()

  console.log("requests", requests)

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
        <Typography>
          <Trans>We got {requests.length} request from another device!</Trans>
        </Typography>
        <Typography>
          {requests.map((request, index) => (
            <>
              <Typography key={index}>
                <Trans>browser:</Trans> {`${request.browserDetail.browser.name}(${request.browserDetail.browser.version}) -
                  ${request.browserDetail.os.name}`}<br/>
                <Trans>on</Trans> {dayjs(request.timestamp).format("ddd D MMMM h:mm a")}<br/>
              </Typography>
              <Button onClick={() => {approveShareTransferRequest(request.encPubKeyX)}}>
                <Trans>Approve</Trans>
              </Button>
              <Button onClick={() => {rejectShareTransferRequest(request.encPubKeyX)}}>
                <Trans>Reject</Trans>
              </Button>
            </>
          ))}
        </Typography>
      </>

    </CustomModal>
  )
}

export default ShareTransferRequestModal