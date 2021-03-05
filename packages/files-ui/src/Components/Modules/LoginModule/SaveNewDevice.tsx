import React, { useState } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { Button, CheckboxInput, Typography } from "@chainsafe/common-components"

const SaveNewDevice: React.FC = () => {
  const { addNewDeviceShareAndSave, resetIsNewDevice } = useThresholdKey()
  const [useFileStorage, setUseFileStorage] = useState<boolean>(false)

  return (
    <>
      <Typography>Would you like to save this device?</Typography>
      <CheckboxInput
        value={useFileStorage}
        onChange={(e) => setUseFileStorage(e.currentTarget.checked)}
        label="Save to file storage"
      />
      <Button onClick={() => addNewDeviceShareAndSave(useFileStorage)}>
        Yes
      </Button>
      <Button onClick={resetIsNewDevice}>No</Button>
    </>
  )
}

export default SaveNewDevice
