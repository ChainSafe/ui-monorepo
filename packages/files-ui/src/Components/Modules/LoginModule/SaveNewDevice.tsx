import React, { useState, useEffect } from "react"
import { Trans } from "@lingui/macro"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import {
  Button,
  CheckboxInput,
  Typography,
} from "@chainsafe/common-components"

const SaveNewDevice: React.FC = () => {
  const { addNewDeviceShareAndSave, disableIsNewDevice } = useThresholdKey()
  const [useFileStorage, setUseFileStorage] = useState<boolean>(false)

  return (
    <>
      <Typography>Would you like to save this device?</Typography>
      <CheckboxInput
        value={useFileStorage}
        //@ts-ignore
        onChange={(e) => setUseFileStorage(e.target.value)}
      />
      <Button onClick={() => addNewDeviceShareAndSave(useFileStorage)}>
        Yes
      </Button>
      <Button onClick={disableIsNewDevice}>No</Button>
    </>
  )
}

export default SaveNewDevice
