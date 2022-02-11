import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"
import { SharedFolderModalMode } from "./types"
import CreateOrManageSharedFolder from "./CreateOrManageSharedFolder"

const useStyles = makeStyles(
  ({ constants, zIndex }: CSFTheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker
      },
      modalInner: {
        backgroundColor: constants.modalDefault.backgroundColor,
        color: constants.modalDefault.color
      }
    })
  }
)

interface ICreateOrManageSharedFolderModalProps {
  mode?: SharedFolderModalMode
  isModalOpen: boolean
  onClose: () => void
  bucketToEdit?: BucketKeyPermission
}

const CreateOrManageSharedFolderModal = (
  { mode, isModalOpen, onClose, bucketToEdit }: ICreateOrManageSharedFolderModalProps
) => {
  const classes = useStyles()

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={isModalOpen}
      closePosition="none"
      maxWidth={500}
      testId="create-or-edit-shared-folder"
    >
      <CreateOrManageSharedFolder
        onClose={onClose}
        mode={mode}
        bucketToEdit={bucketToEdit}
      />
    </CustomModal>
  )
}

export default CreateOrManageSharedFolderModal
