import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import CustomModal from "../../Elements/CustomModal"
import { CSFTheme } from "../../../Themes/types"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"
import { SharedFolderModalMode } from "./types"
import LinkList from "./LinkSharing/LinkList"
import CreateOrManageSharedFolder from "./CreateOrManageSharedFolder"

const useStyles = makeStyles(
  ({ breakpoints, constants, zIndex }: CSFTheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {
          paddingBottom: Number(constants?.mobileButtonHeight) + constants.generalUnit
        }
      },
      modalInner: {
        backgroundColor: constants.modalDefault.backgroundColor,
        color: constants.modalDefault.color,
        [breakpoints.down("md")]: {
          bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
      },
      subModal: {
        width: "100%"
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
        inner: classes.modalInner,
        subModalInner: classes.subModal
      }}
      active={isModalOpen}
      closePosition="none"
      maxWidth="sm"
      testId="create-or-edit-shared-folder"
      subModal={mode === "edit" && !!bucketToEdit && (
        <LinkList
          bucketEncryptionKey={bucketToEdit.encryptionKey}
          bucketId={bucketToEdit.id}
        />
      )}
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
