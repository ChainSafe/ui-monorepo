import {
  Button,
  Modal,
  TextInput,
  Typography,
} from "@chainsafe/common-components"
import { useDrive } from "@chainsafe/common-contexts"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React, { ChangeEvent } from "react"
import { useState } from "react"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {},
  }),
)

const CreateFolder: React.FC = () => {
  const classes = useStyles()
  const { createFolder, currentPath } = useDrive()
  const [folderName, setFolderName] = useState("")
  const [open, setOpen] = useState(false)

  const handleFolderNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFolderName(e.target.value)

  const handleCreateFolder = () => {
    createFolder({ path: currentPath + folderName })
    handleCloseDialog()
  }

  const handleCloseDialog = () => setOpen(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="primary" size="large">
        Open Dialog
      </Button>
      <Modal active={open} closePosition="none">
        <Typography>Folder Name</Typography>
        <TextInput value={folderName} onChange={handleFolderNameChange} />
        <Button onClick={handleCloseDialog} size="medium">
          Cancel
        </Button>
        <Button onClick={handleCreateFolder} size="medium">
          OK
        </Button>
      </Modal>
    </>
  )
}

export default CreateFolder
