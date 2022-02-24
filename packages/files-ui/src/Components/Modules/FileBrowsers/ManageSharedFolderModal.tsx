import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"
import ManageSharedFolder from "./ManageSharedFolder"

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
  isModalOpen: boolean
  onClose: () => void
  bucketToEdit?: BucketKeyPermission
}

const CreateOrManageSharedFolderModal = ({ isModalOpen, onClose, bucketToEdit }: ICreateOrManageSharedFolderModalProps) => {
  const classes = useStyles()

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={isModalOpen}
      closePosition="none"
      maxWidth={500}
      testId="edit-shared-folder"
    >
      <ManageSharedFolder
        onClose={onClose}
        bucketToEdit={bucketToEdit}
      />
    </CustomModal>
  )
}

export default CreateOrManageSharedFolderModal
