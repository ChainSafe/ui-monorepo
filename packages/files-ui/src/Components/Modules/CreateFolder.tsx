import {
  Button,
  Grid,
  Modal,
  TextInput,
  Typography,
} from "@chainsafe/common-components"
import { useDrive } from "@chainsafe/common-contexts"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React, { ChangeEvent } from "react"
import { useState } from "react"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit * 4,
    },
    input: {
      marginBottom: constants.generalUnit * 2,
    },
    okButton: {
      marginLeft: constants.generalUnit,
      color: palette.common.white.main,
      backgroundColor: palette.common.black.main,
    },
    cancelButton: {
      color: palette.common.black.main,
      backgroundColor: palette.common.white.main,
    },
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
        Create folder
      </Button>
      <Modal active={open} closePosition="none" maxWidth="sm">
        <Grid container flexDirection="column" className={classes.root}>
          <Grid item xs={12}>
            <Typography>Folder Name</Typography>
          </Grid>
          <Grid item xs={12} className={classes.input}>
            <TextInput
              value={folderName}
              onChange={handleFolderNameChange}
              size="large"
              placeholder="Name"
            />
          </Grid>
          <Grid item flexDirection="row" justifyContent="flex-end">
            <Button
              onClick={handleCloseDialog}
              size="medium"
              className={classes.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              size="medium"
              className={classes.okButton}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      </Modal>
    </>
  )
}

export default CreateFolder
