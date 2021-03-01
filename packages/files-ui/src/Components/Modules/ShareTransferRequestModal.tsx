import { Button, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import { ShareTransferRequest } from "../../Contexts/ThresholdKeyContext"
import CustomModal from "../Elements/CustomModal"

interface Props {
    requests: ShareTransferRequest[]
}
const ShareTransferRequestModal = ({ requests }: Props) => {
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
            An error occurred and has been logged. If you would like to
            provide additional info to help us debug and resolve the issue,
            click the `&quot;`Provide Additional Details`&quot;` button
        </Typography>
        <Button
          onClick={() => {}}
        >
            Provide Additional Details
        </Button>
        <Button onClick={() => {}}>Reset error</Button>
      </>

    </CustomModal>
  )
}

export default ShareTransferRequestModal