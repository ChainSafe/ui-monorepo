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
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        //@ts-ignore
        onChange={(e) => setUseFileStorage(e.target.value)}
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
